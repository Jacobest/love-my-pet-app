import React, { useState } from 'react';
import { Mail, MapPin, Send } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import { useSettings } from '../contexts/SettingsContext';

const ContactPage: React.FC = () => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      setSubmitMessage('Thank you for your message! We will get back to you shortly.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-primary">Get in Touch</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          Have a question or feedback? We'd love to hear from you. Fill out the form below or use one of the contact methods provided.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-brand-dark mb-6">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input id="name" name="name" label="Your Name" value={formData.name} onChange={handleChange} required />
            <Input id="email" name="email" type="email" label="Your Email" value={formData.email} onChange={handleChange} required />
            <Input id="subject" name="subject" label="Subject" value={formData.subject} onChange={handleChange} required />
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
              ></textarea>
            </div>
            <div>
              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </Button>
            </div>
            {submitMessage && (
              <p className="text-center text-green-600 font-semibold pt-2">{submitMessage}</p>
            )}
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-brand-dark flex items-center gap-3">
              <Mail className="h-6 w-6 text-brand-secondary" />
              Contact by Email
            </h3>
            <p className="mt-2 text-gray-600">
              For general inquiries, support, or feedback, please email us at:
            </p>
            <a href={`mailto:${settings.general.contactEmail}`} className="text-brand-primary font-semibold hover:underline text-lg break-all">
              {settings.general.contactEmail}
            </a>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-brand-dark flex items-center gap-3">
              <MapPin className="h-6 w-6 text-brand-secondary" />
              Mailing Address
            </h3>
            <address className="mt-2 not-italic text-gray-600 whitespace-pre-wrap">
                {settings.general.contactAddress}
            </address>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
