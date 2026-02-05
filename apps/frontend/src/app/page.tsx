'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChatDialog,
  CustomerControlPanel,
  GeneratedCommunityCardStack,
  FullscreenCard,
  Stepper,
  WhiteboardBackground,
} from '@/components/fullscreen-cards';
import { Header } from '@/components/Header';
import { useGenerateCustomers } from '@/api/queries/customers';
import { useGenerateCommunities } from '@/api/queries/communities';
import { usePersona } from '@/contexts/PersonaContext';
import { GeneratingMessage } from '@/components/LoadingSkeleton';
import FeedbackButton from '@/components/FeedbackButton';

const CARD_IDS = ['card-1', 'card-2', 'card-3', 'card-4'] as const;

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const {
    persona,
    setPersona,
    customers,
    setCustomers,
    communities,
    setCommunities,
  } = usePersona();

  const generateCustomers = useGenerateCustomers();
  const generateCommunities = useGenerateCommunities();

  const [hasGeneratedCommunities, setHasGeneratedCommunities] = useState(false);

  const scrollToCard = useCallback((index: number) => {
    const cardId = CARD_IDS[index];
    if (!cardId) return;
    const element = document.getElementById(cardId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    CARD_IDS.forEach((cardId, index) => {
      const element = document.getElementById(cardId);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveStep(index);
            }
          });
        },
        { threshold: 0.5 },
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <main
      ref={containerRef}
      className="h-screen snap-y snap-mandatory overflow-y-scroll"
    >
      <Header />
      <Stepper steps={4} currentStep={activeStep} onStepClick={scrollToCard} />

      <FullscreenCard id="card-1" centerContent showNextButton={false}>
        <div className="flex flex-col items-center gap-6">
          <ChatDialog
            welcomeTitle="Let's find your audience"
            welcomeMessage="Describe your target customer in the prompt box below - we'll analyse real people meeting this description to find where they pay attention online. The more specific, the better."
            placeholder="Describe your ideal customer..."
            onSubmit={(message) => {
              void (async () => {
                setPersona(message);
                setHasGeneratedCommunities(false);

                // Use setTimeout to ensure scroll happens after React updates
                setTimeout(() => scrollToCard(1), 0);

                try {
                  const generatedCustomers =
                    await generateCustomers.mutateAsync({
                      persona: message,
                      count: 5,
                    });
                  setCustomers(generatedCustomers);
                } catch (error) {
                  console.error('Failed to generate customers:', error);
                }
              })();
            }}
          />

          {/* Discover optimum target feedback button */}
          <FeedbackButton
            question="*This feature is in development* To help us make it as powerful as possible, can you tell us a. the product you sell and b. what details you want in your customer profile?"
            buttonText="Don't know your target customer? Discover with data"
            onClick={() => {
              // No navigation - just collect feedback
            }}
            answerType="text"
            className="group relative overflow-hidden rounded-xl border-2 border-emerald-500/30 bg-emerald-900/20 px-6 py-3 text-base font-medium text-emerald-400 transition-all hover:border-emerald-500/50 hover:bg-emerald-900/30 hover:text-emerald-300"
          >
            <>Don&apos;t know your target customer? Discover with data</>
          </FeedbackButton>
        </div>
      </FullscreenCard>

      <section
        id="card-2"
        className="relative flex h-screen snap-start flex-col overflow-x-hidden pt-14"
      >
        <WhiteboardBackground />

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center pb-8">
          {/* Title and Description - Centered */}
          <div className="shrink-0 text-center">
            <h2 className="text-3xl font-bold text-white">
              Your Ideal Customers
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-slate-400">
              Based on your description, here&apos;s a sample of people who
              match your ideal customer profile. Not quite right?{' '}
              <button
                onClick={() => scrollToCard(0)}
                className="font-semibold text-slate-300 underline underline-offset-2 transition-colors hover:text-white"
              >
                Go back
              </button>{' '}
              to refine your description.
            </p>
          </div>

          {/* Customer Control Panel / Carousel */}
          <div className="mt-6 flex-1 w-full">
            {generateCustomers.isPending ? (
              <div className="flex h-full items-center justify-center">
                <GeneratingMessage message="Analyzing your ideal customers..." />
              </div>
            ) : generateCustomers.isError ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <p className="text-lg text-red-400">
                    Failed to generate customers
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {generateCustomers.error instanceof Error
                      ? generateCustomers.error.message
                      : 'Unknown error'}
                  </p>
                </div>
              </div>
            ) : customers ? (
              <CustomerControlPanel
                customers={customers}
                onViewCommunities={() => {
                  void (async () => {
                    setTimeout(() => scrollToCard(2), 0);
                    if (!hasGeneratedCommunities && persona && customers) {
                      try {
                        const generatedCommunities =
                          await generateCommunities.mutateAsync({
                            persona,
                            customers,
                            count: 5,
                          });
                        setCommunities(generatedCommunities);
                        setHasGeneratedCommunities(true);
                      } catch (error) {
                        console.error('Failed to generate communities:', error);
                      }
                    }
                  })();
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-lg text-gray-300">
                  Enter a persona description to generate customers
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        id="card-3"
        className="relative flex h-screen snap-start flex-col overflow-hidden pt-14"
      >
        <WhiteboardBackground />

        {/* Header - centered */}
        <div className="relative z-20 mb-2 mt-16 shrink-0 text-center">
          <h2 className="text-3xl font-bold text-white">
            Where Your Customers Pay Attention
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-slate-400">
            These are the communities and channels where your ideal customers
            are most engaged. Focus your marketing efforts here to maximize
            reach and improve conversion rates.
          </p>

          {/* Content and trend insights feedback button */}
          <div className="mt-6 flex justify-center">
            <FeedbackButton
              question="Feature in development. To make it as effective as possible, what specifically would you like to see? Is it the content customers are engaging with, emerging trends, key talking points and community focuses etc.? If possible, quantify how this would benefit you or what problem it would solve, i.e. this would inform content and save 4 hours per week in manual research"
              buttonText="See content and trend insights instead"
              onClick={() => {
                // No navigation - just collect feedback
              }}
              answerType="text"
              className="group relative overflow-hidden rounded-xl border-2 border-emerald-500/30 bg-emerald-900/20 px-6 py-3 text-base font-medium text-emerald-400 transition-all hover:border-emerald-500/50 hover:bg-emerald-900/30 hover:text-emerald-300"
            >
              <>See content and trend insights instead</>
            </FeedbackButton>
          </div>
        </div>

        {/* Card Stack - takes remaining space */}
        <div className="relative z-10 mt-6 min-h-0 flex-1 overflow-y-auto">
          {generateCommunities.isPending ? (
            <div className="flex h-full items-center justify-center">
              <GeneratingMessage message="Finding where your customers pay attention..." />
            </div>
          ) : generateCommunities.isError ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-lg text-red-400">
                  Failed to generate communities
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {generateCommunities.error instanceof Error
                    ? generateCommunities.error.message
                    : 'Unknown error'}
                </p>
              </div>
            </div>
          ) : communities ? (
            <GeneratedCommunityCardStack communities={communities} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-lg text-gray-300">
                Analyze customers first to see community recommendations
              </p>
            </div>
          )}
        </div>

        {/* Complete Demo Button */}
        <div className="relative z-20 pb-8 pt-4 flex shrink-0 justify-center">
          <button
            onClick={() => scrollToCard(3)}
            disabled={!communities}
            onMouseEnter={(e) =>
              e.currentTarget.setAttribute('data-hover', 'true')
            }
            onMouseLeave={(e) => e.currentTarget.removeAttribute('data-hover')}
            className="group relative overflow-hidden rounded-xl border border-white/10 px-8 py-4 text-base font-medium text-slate-300 transition-all hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Gradient background on hover */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-40"
              style={{ backgroundImage: 'url(/gradient-bg.png)' }}
            />
            {/* Solid background */}
            <div className="absolute inset-0 bg-[#232323] opacity-100 transition-opacity duration-500 ease-out group-hover:opacity-70" />
            <span className="relative z-10">Complete Demo</span>
          </button>
        </div>
      </section>

      <section
        id="card-4"
        className="relative flex h-screen snap-start flex-col overflow-hidden pt-14"
      >
        <WhiteboardBackground />

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4">
          <div className="max-w-2xl w-full">
            {/* Sign-up Box */}
            <div className="rounded-2xl border border-white/10 bg-[#1a1a1a]/80 backdrop-blur-sm p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Reach Your Customers?
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                If what we&apos;re building seems like it would add value for
                you, sign up as an early adopter. You won&apos;t be charged
                until after Talentsheet is launched, and you&apos;ve had a two
                week free trial. Additionally, you&apos;ll get extensive beta
                access and testing before then.
              </p>

              {/* Pricing Section */}
              <div className="border-t border-white/10 pt-6 mb-8">
                <div className="flex items-baseline justify-center gap-2 mb-3">
                  <span className="text-4xl font-bold text-emerald-400">
                    $100
                  </span>
                  <span className="text-xl text-slate-400">/track/month</span>
                </div>
                <p className="text-sm text-slate-400 max-w-lg mx-auto">
                  A &quot;track&quot; can be a persona, a competitor, or an
                  online audience such as a social media following.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* Sign Up Button */}
                <a
                  href="https://buy.stripe.com/6oUaEZbYv7pLf8j8Bs9R609"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-xl bg-emerald-600 px-8 py-4 text-base font-medium text-white transition-all hover:bg-emerald-500"
                >
                  Sign Up
                </a>

                {/* Maybe Later Button with Feedback */}
                <FeedbackButton
                  question="What did you like and dislike about the product? Why didn't you sign up for presale, and what would you need the software to have to become a customer?"
                  buttonText="Maybe Later"
                  onClick={() => {
                    // Feedback is collected via Mixpanel in FeedbackButton
                  }}
                  answerType="text"
                  className="relative overflow-hidden rounded-xl border-2 border-white/20 bg-transparent px-8 py-4 text-base font-medium text-slate-300 transition-all hover:border-white/40 hover:text-white"
                >
                  <>Maybe Later</>
                </FeedbackButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
