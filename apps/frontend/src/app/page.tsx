'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChatDialog,
  CommunityCardStack,
  CustomerCarousel,
  FullscreenCard,
  Stepper,
  WhiteboardBackground,
} from '@/components/fullscreen-cards';
import { Header } from '@/components/Header';
import { useGetCommunities, useGetCustomers } from '@/api/queries';

const CARD_IDS = ['card-1', 'card-2', 'card-3'] as const;

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const { data: customersData, isLoading: isLoadingCustomers } =
    useGetCustomers();
  const { data: communitiesData, isLoading: isLoadingCommunities } =
    useGetCommunities();

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
        <ChatDialog
          welcomeTitle="Let's find your audience"
          welcomeMessage="Describe your target customer in the prompt box below - we'll analyse real people meeting this description to find where they pay attention online. The more specific, the better."
          placeholder="Describe your ideal customer..."
          onSubmit={(message) => {
            console.log('Submitted:', message);
            scrollToCard(1);
          }}
        />
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
            {isLoadingCustomers ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-lg text-gray-300">Loading customers...</p>
              </div>
            ) : customersData?.customers ? (
              <CustomerCarousel customers={customersData.customers} />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-lg text-gray-300">No customers found</p>
              </div>
            )}
          </div>

          {/* Analyse CTA Button */}
          <div className="mt-4 flex shrink-0 justify-center">
            <button
              onClick={() => scrollToCard(2)}
              onMouseEnter={(e) =>
                e.currentTarget.setAttribute('data-hover', 'true')
              }
              onMouseLeave={(e) =>
                e.currentTarget.removeAttribute('data-hover')
              }
              className="group relative overflow-hidden rounded-xl border border-white/10 px-8 py-4 text-base font-medium text-slate-300 transition-all hover:text-white"
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
          {isLoadingCommunities ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-lg text-gray-300">
                Finding best communities...
              </p>
            </div>
          ) : communitiesData?.communities ? (
            <CommunityCardStack communities={communitiesData.communities} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-lg text-gray-300">No communities found</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
