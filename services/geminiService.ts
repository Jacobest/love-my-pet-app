

import { GoogleGenAI } from "@google/genai";
import { Pet } from '../types';

// FIX: Initialize GoogleGenAI with API_KEY directly from environment variables as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


// FIX: Redefined this type to accurately reflect the data needed for AI generation from the form.
// The previous Omit-based type was incorrect and did not match the actual form data shape.
type PetFormData = Pick<Pet, 'name' | 'species' | 'breed' | 'color' | 'age' | 'roamingArea'> & {
  personalityTraits: string;
};

export const generatePetDescription = async (petInfo: PetFormData, imageBase64DataUrl: string | null): Promise<string> => {
  const prompt = `Write a heartwarming, short profile description for a pet. The description should be suitable for a social platform for pet lovers and should highlight the pet's unique charm.
  
  Use the provided image to describe the pet's physical appearance, including its fur color, markings, and any distinguishing features.
  
  Pet Details:
  - Name: ${petInfo.name}
  - Species: ${petInfo.species}
  - Breed: ${petInfo.breed}
  - Color: ${petInfo.color}
  - Age: ${petInfo.age}
  - Personality Traits: ${petInfo.personalityTraits}

  Generate the description now.`;

  try {
    const textPart = { text: prompt };
    
    if (imageBase64DataUrl) {
      const parts = imageBase64DataUrl.match(/data:(.*);base64,(.*)/);
      if (parts && parts.length === 3) {
        const mimeType = parts[1];
        const base64Data = parts[2];
        const imagePart = {
          inlineData: {
            mimeType,
            data: base64Data,
          },
        };
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [textPart, imagePart] },
        });
        return response.text;
      } else {
        console.warn("Invalid image data URL, generating description without image.");
      }
    }
    
    // Fallback to text-only if no image or invalid image URL
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;

  } catch (error) {
    console.error("Error generating pet description:", error);
    return "Could not generate AI description. Please write one manually.";
  }
};

export const generatePetKeywords = async (petInfo: PetFormData): Promise<string[]> => {
  const prompt = `Based on the following pet profile, generate 5-7 relevant keywords for search and filtering. Keywords should include breed, color, size, temperament, and location hints. Return as a single comma-separated string without any introductory text.

  Pet Details:
  - Name: ${petInfo.name}
  - Species: ${petInfo.species}
  - Breed: ${petInfo.breed}
  - Color: ${petInfo.color}
  - Age: ${petInfo.age}
  - Primary Roaming Area: ${petInfo.roamingArea}
  - Personality Traits: ${petInfo.personalityTraits}
  
  Example output: golden retriever, friendly, energetic, family dog, large, golden, central park
  
  Generate the keywords now.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text.split(',').map(kw => kw.trim()).filter(Boolean);
  } catch (error) {
    console.error("Error generating pet keywords:", error);
    return [];
  }
};

export const generateMissingPetMessage = async (pet: Pet, lastSeenLocation: string, lastSeenTime: string): Promise<string> => {
    const prompt = `
    You are a helpful assistant for a community of pet lovers. A user has lost their pet and needs to write an alert message.
    Based on the details below, write a clear, concise, and heartfelt message to the community.
    The message should include the pet's name, a brief description of its appearance and personality, its last seen location and time, and a call to action.
    Do not add any introductory text like "Here is a draft:". Just generate the message itself.

    Pet Details:
    - Name: ${pet.name}
    - Species: ${pet.species}
    - Breed: ${pet.breed}
    - Color: ${pet.color}
    - Key characteristics from profile: ${pet.description}

    Last Seen:
    - Location: ${lastSeenLocation}
    - Time: ${lastSeenTime}

    Generate the message now.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating missing pet message:", error);
        return "Could not generate AI message. Please write one manually.";
    }
};

export const generateOwnerTestimonial = async (pet: Pet): Promise<string> => {
    const prompt = `Write a short, heartfelt testimonial from a pet owner who has just been reunited with their pet.
    The pet's name is ${pet.name}, a ${pet.breed}.
    The tone should be relieved and happy. Focus on the joy of having them back.
    Do not add any introductory text like "Here is a draft:". Just generate the testimonial itself.
    Keep it to about 2-3 sentences.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating owner testimonial:", error);
        return "Could not generate AI testimonial. Please write one manually.";
    }
};

export const generateFinderTestimonial = async (pet: Pet): Promise<string> => {
    const prompt = `Write a short, positive testimonial from the perspective of someone who found a lost pet.
    The pet's name is ${pet.name}. They were last seen near ${pet.lastSeenLocation}.
    The tone should be happy and humble. Focus on the positive feeling of helping out.
    Do not add any introductory text like "Here is a draft:". Just generate the testimonial itself.
    Keep it to about 2-3 sentences.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating finder testimonial:", error);
        return "Could not generate AI testimonial. Please write one manually.";
    }
};