'use client';

import { useState } from 'react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Search, Lightbulb, Bug, Wrench, Handshake, HelpCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    app: '',
    purpose: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const purposes = [
    { value: 'general', label: 'General Inquiry', icon: <Search className="w-4 h-4" /> },
    { value: 'feature', label: 'Feature Request', icon: <Lightbulb className="w-4 h-4" /> },
    { value: 'bug', label: 'Bug Report', icon: <Bug className="w-4 h-4" /> },
    { value: 'technical', label: 'Technical Support', icon: <Wrench className="w-4 h-4" /> },
    { value: 'partnership', label: 'Partnership Opportunity', icon: <Handshake className="w-4 h-4" /> },
    { value: 'other', label: 'Other', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        app: '',
        purpose: '',
        message: ''
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
          </div>
        </div>
      </nav>

      <main className="flex min-h-screen flex-col items-center p-8 md:p-24 pt-24">
        <div className="max-w-3xl w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Contact</h1>
            <p className="text-lg text-muted-foreground">
              Contact us for any questions or feedback
            </p>
          </div>

          {/* Contact Form */}
          <div className="bg-card p-8 rounded-lg border shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
            <p className="text-muted-foreground mb-8">We will get back to you as soon as possible</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded-md border bg-background"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded-md border bg-background"
                />
              </div>

              {/* App Selection */}
              <div>
                <label htmlFor="app" className="block text-sm font-medium mb-2">
                  Which app?
                </label>
                <select
                  id="app"
                  name="app"
                  value={formData.app}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded-md border bg-background"
                >
                  <option value="">Select an app</option>
                  <option value="image-convert">Image Convert</option>
                </select>
              </div>

              {/* Purpose */}
              <div>
                <label htmlFor="purpose" className="block text-sm font-medium mb-2">
                  What this is for?
                </label>
                <select
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded-md border bg-background"
                >
                  <option value="">Select a purpose</option>
                  {purposes.map((purpose) => (
                    <option key={purpose.value} value={purpose.value}>
                      {purpose.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full p-2 rounded-md border bg-background resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
} 