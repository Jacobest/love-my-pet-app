import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStories } from '../hooks/useStories';
import { FoundPetStory } from '../types';
import Input from '../components/Input';
import Button from '../components/Button';
import { PawPrint, CheckCircle, AlertTriangle } from 'lucide-react';
import Spinner from '../components/Spinner';
import { generateFinderTestimonial } from '../services/geminiService';
import TypingIndicator from '../components/TypingIndicator';

type PageState = 'loading' | 'form' | 'success' | 'error';

const FinderTestimonialPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { stories, updateFoundPetStory } = useStories();

  const [pageState, setPageState] = useState<PageState>('loading');
  const [story, setStory] = useState<FoundPetStory | null>(null);
  const [finderName, setFinderName] = useState('');
  const [testimonial, setTestimonial] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (token) {
      const foundStory = stories.find(s => s.finderUniqueToken === token);
      if (foundStory) {
        // Check if testimonial already submitted to prevent reuse of link
        if(foundStory.finderTestimonialStatus === 'AwaitingModeration' || foundStory.finderTestimonialStatus === 'Approved') {
            setPageState('error');
        } else {
            setStory(foundStory);
            setPageState('form');
        }
      } else {
        setPageState('error');
      }
    } else {
      setPageState('error');
    }
  }, [token, stories]);

  const handleGenerateAI = async () => {
    if (!story) return;
    setIsGenerating(true);
    const generatedText = await generateFinderTestimonial(story.pet);
    setTestimonial(generatedText);
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!story || !finderName.trim() || !testimonial.trim()) {
      alert('Please fill out all fields.');
      return;
    }
    setIsSubmitting(true);
    
    updateFoundPetStory(story.id, {
      finderName: finderName.trim(),
      finderTestimonial: testimonial.trim(),
      finderUniqueToken: undefined, // Invalidate the token
    });

    setTimeout(() => {
        setIsSubmitting(false);
        setPageState('success');
    }, 1000);
  };
  
  const renderContent = () => {
    switch(pageState) {
        case 'loading':
            return <Spinner />;
        case 'error':
            return (
                <div className="text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-900">Invalid Link</h3>
                    <p className="mt-2 text-sm text-gray-600">
                    This testimonial link is either invalid, has expired, or has already been used.
                    </p>
                    <Button as={Link} to="/" className="mt-6">Go to Homepage</Button>
                </div>
            );
        case 'success':
            return (
                 <div className="text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-900">Thank You!</h3>
                    <p className="mt-2 text-sm text-gray-600">
                        Your story has been submitted for review. Thank you for your kindness and for helping reunite {story?.pet.name} with their family!
                    </p>
                    <Button as={Link} to="/" className="mt-6">Explore LoveMyPet</Button>
                </div>
            );
        case 'form':
            if (!story) return null;
            return (
                <>
                <div className="flex flex-col items-center gap-4 mb-6 text-center">
                    <img src={story.pet.photoUrls[0]} alt={story.pet.name} className="h-24 w-24 rounded-full object-cover ring-4 ring-brand-primary/50" />
                    <div>
                        <h2 className="text-2xl font-bold">You found {story.pet.name}!</h2>
                        <p className="text-gray-500">Thank you for helping with this happy reunion. Please share your story below.</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        id="finderName"
                        name="finderName"
                        label="Your Name"
                        placeholder="e.g., A Kind Stranger"
                        value={finderName}
                        onChange={(e) => setFinderName(e.target.value)}
                        required
                    />
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="testimonial" className="block text-sm font-medium text-gray-700">Your Testimonial</label>
                            <Button type="button" variant="ghost" size="sm" onClick={handleGenerateAI} disabled={isGenerating}>
                                ✨ Generate with AI
                            </Button>
                        </div>
                         {isGenerating && <TypingIndicator />}
                        <textarea
                            id="testimonial"
                            name="testimonial"
                            rows={6}
                            value={testimonial}
                            onChange={(e) => setTestimonial(e.target.value)}
                            placeholder={`Tell us how you found ${story.pet.name}...`}
                            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
                            required
                        ></textarea>
                    </div>
                    <Button type="submit" className="w-full" isLoading={isSubmitting}>
                        Submit My Story
                    </Button>
                </form>
                </>
            );
    }
  }


  return (
     <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
        <div className="flex justify-center">
          <PawPrint className="h-12 w-auto text-brand-primary" />
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default FinderTestimonialPage;