import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Envelope, MapPin, Phone } from '@phosphor-icons/react'

const Footer = () => (
  <footer className="py-8 text-center">
    <div className="container mx-auto px-6">
      <div className="text-sm text-muted-foreground">
        © 2024 Product Viz. All rights reserved. • Contact us: <a href="mailto:hello@productviz.com" className="text-accent hover:underline">hello@productviz.com</a>
      </div>
    </div>
  </footer>
);

export const AboutPage = () => (
  <>
    <div className="bg-muted/30 py-20">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About Product Viz</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          We're revolutionizing interior design by making it accessible, interactive, and instant. Our AI-powered platform empowers anyone to visualize and shop for home furnishings within their own space, transforming interior design from guesswork into creativity.
        </p>
      </div>
    </div>

    <div className="container mx-auto px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We provide professional interior design visualization services powered by AI technology. Submit your room photos and design preferences, and receive custom visualizations delivered directly to your email within 3-5 business days.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="text-center p-8 border-0 shadow-lg">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-xl font-bold mb-4">Professional Design Team</h3>
            <p className="text-muted-foreground">Our experienced interior designers use advanced AI tools to create realistic, contextual design solutions.</p>
          </Card>
          <Card className="text-center p-8 border-0 shadow-lg">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">📷</span>
            </div>
            <h3 className="text-xl font-bold mb-4">Photo-Realistic Results</h3>
            <p className="text-muted-foreground">See exactly how furniture will look in your actual room with accurate rendering.</p>
          </Card>
          <Card className="text-center p-8 border-0 shadow-lg">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">📧</span>
            </div>
            <h3 className="text-xl font-bold mb-4">Email Delivery Service</h3>
            <p className="text-muted-foreground">Receive high-quality visualizations delivered directly to your email within 3-5 business days.</p>
          </Card>
        </div>

        <div className="bg-card rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-12">How Product Viz Works</h2>
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">1</div>
                  <h3 className="text-xl font-bold">Upload Your Space</h3>
                </div>
                <p className="text-muted-foreground">Upload your room photo and submit your request. Our design team will analyze the space.</p>
              </div>
              <div className="w-full md:w-80 h-48 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-4xl">📷</span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">2</div>
                  <h3 className="text-xl font-bold">Describe Your Vision</h3>
                </div>
                <p className="text-muted-foreground">Describe your vision or upload specific furniture photos. Our designers will interpret your preferences.</p>
              </div>
              <div className="w-full md:w-80 h-48 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-4xl">✍️</span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">3</div>
                  <h3 className="text-xl font-bold">Receive Professional Results</h3>
                </div>
                <p className="text-muted-foreground">Within 3-5 business days, receive professional-quality visualizations delivered to your email.</p>
              </div>
              <div className="w-full md:w-80 h-48 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-4xl">📧</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mt-20 text-center">
          <div>
            <div className="text-4xl font-bold text-accent mb-2">10K+</div>
            <p className="text-muted-foreground">Rooms Transformed</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-accent mb-2">25K+</div>
            <p className="text-muted-foreground">Happy Users</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-accent mb-2">50+</div>
            <p className="text-muted-foreground">Retail Partners</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-accent mb-2">98%</div>
            <p className="text-muted-foreground">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-muted/30 py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg text-muted-foreground">Have questions? We'd love to hear from you.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <Card className="p-8">
            <h3 className="text-xl font-bold mb-6">Send us a message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help?" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={4} placeholder="Your message..." />
              </div>
              <Button className="w-full">
                <Envelope className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </Card>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <Envelope className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:hello@productviz.com" className="text-accent hover:underline">hello@productviz.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Office</p>
                    <p className="text-muted-foreground">San Francisco, CA</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Response Time</p>
                    <p className="text-muted-foreground">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="p-6 bg-accent/5 border-accent/20">
              <h4 className="font-bold mb-3">Need immediate help?</h4>
              <p className="text-sm text-muted-foreground mb-4">Check out our help documentation or community forum.</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Help Center</Button>
                <Button variant="outline" size="sm">Community</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </>
);