'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChatDialog,
  GeneratedCommunityCardStack,
  GeneratedCustomerCarousel,
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

const CARD_IDS = ['card-1', 'card-2', 'card-3'] as const;

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
      <Stepper steps={3} currentStep={activeStep} onStepClick={scrollToCard} />

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
                scrollToCard(1);

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
            question="This feature is in development. To help us build the best product, tell us what would you like to learn about your target customer, and how this would impact your marketing activities"
            buttonText="Discover optimum target"
            onClick={() => {
              // No navigation - just collect feedback
            }}
            answerType="text"
            className="group relative overflow-hidden rounded-xl border-2 border-emerald-500/30 bg-emerald-900/20 px-6 py-3 text-base font-medium text-emerald-400 transition-all hover:border-emerald-500/50 hover:bg-emerald-900/30 hover:text-emerald-300"
          >
            <>Discover optimum target</>
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
            <div className="mt-2 inline-block rounded-lg bg-emerald-900/30 px-4 py-2">
              <span className="text-sm font-medium text-emerald-400">
                <span className="font-bold">6022</span> real people analysed in{' '}
                <span className="font-bold">across five platforms.</span>
              </span>
            </div>
          </div>

          {/* Carousel */}
          <div className="mt-6 h-[480px] w-full shrink-0">
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
              <GeneratedCustomerCarousel customers={customers} />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-lg text-gray-300">
                  Enter a persona description to generate customers
                </p>
              </div>
            )}
          </div>

          {/* Analyse CTA Button */}
          <div className="mt-4 flex shrink-0 justify-center">
            <button
              onClick={() => {
                void (async () => {
                  scrollToCard(2);
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
              disabled={!customers || generateCustomers.isPending}
              onMouseEnter={(e) =>
                e.currentTarget.setAttribute('data-hover', 'true')
              }
              onMouseLeave={(e) =>
                e.currentTarget.removeAttribute('data-hover')
              }
              className="group relative overflow-hidden rounded-xl border border-white/10 px-8 py-4 text-base font-medium text-slate-300 transition-all hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Gradient background on hover */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-40"
                style={{ backgroundImage: 'url(/gradient-bg.png)' }}
              />
              {/* Solid background */}
              <div className="absolute inset-0 bg-[#232323] opacity-100 transition-opacity duration-500 ease-out group-hover:opacity-70" />
              <span className="relative z-10">Analyse Customers</span>
            </button>
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
        </div>

        {/* Card Stack - takes remaining space */}
        <div className="relative z-10 mt-12 min-h-0 flex-1">
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
      </section>
    </main>
  );
}
