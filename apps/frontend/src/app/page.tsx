'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChatDialog,
  CommunityCardStack,
  CosmicBackground,
  CustomerCarousel,
  FullscreenCard,
  Stepper,
} from '@/components/fullscreen-cards';
import { Button } from '@/components/ui/button';
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
      <Stepper steps={3} currentStep={activeStep} onStepClick={scrollToCard} />

      <FullscreenCard
        id="card-1"
        title="Step 1: Welcome"
        theme="grey"
        centerContent
        showNextButton={false}
      >
        <div className="flex flex-col items-center gap-6">
          <p className="max-w-2xl text-center text-lg text-gray-300">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <ChatDialog
            welcomeTitle="Hello! I'm your AI assistant"
            welcomeMessage="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            placeholder="What is your customer persona?"
            onSubmit={(message) => {
              console.log('Submitted:', message);
              scrollToCard(1);
            }}
          />
        </div>
      </FullscreenCard>

      <section
        id="card-2"
        className="relative flex h-screen snap-start flex-col"
      >
        {/* Title overlay */}
        <div className="absolute left-0 right-0 top-0 z-20 bg-gradient-to-b from-black/50 to-transparent p-8">
          <h2 className="text-3xl font-bold text-white">Meet Your Customers</h2>
          <p className="mt-3 max-w-2xl text-purple-200">
            Are these your customers? Go{' '}
            <button
              onClick={() => scrollToCard(0)}
              className="font-semibold text-purple-300 underline underline-offset-2 transition-colors hover:text-white"
            >
              back
            </button>{' '}
            to retry your prompt or click &apos;analyse&apos; to analyse them
            and find where they lurk online. This is a small sample of 100
            accounts we think are relevant to you (our search will use a bigger
            data set behind the scenes).
          </p>
        </div>

        {/* Carousel */}
        {isLoadingCustomers ? (
          <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900">
            <p className="text-lg text-purple-300">Loading customers...</p>
          </div>
        ) : customersData?.customers ? (
          <CustomerCarousel customers={customersData.customers} />
        ) : (
          <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900">
            <p className="text-lg text-purple-300">No customers found</p>
          </div>
        )}

        {/* Analyse CTA Button */}
        <div className="absolute bottom-8 right-8 z-20">
          <Button
            onClick={() => scrollToCard(2)}
            size="lg"
            className="bg-purple-600 px-8 py-6 text-lg font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:bg-purple-500 hover:shadow-xl hover:shadow-purple-500/40"
          >
            Analyse
          </Button>
        </div>
      </section>

      <section
        id="card-3"
        className="relative flex h-screen snap-start flex-col overflow-hidden"
      >
        <CosmicBackground theme="emerald" />

        {/* Header - fixed height to prevent overlap */}
        <div className="relative z-20 shrink-0 px-8 pb-4 pt-8">
          <h2 className="text-3xl font-bold text-white">
            Best Places to Advertise
          </h2>
          <p className="mt-2 max-w-2xl text-emerald-200">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl.
          </p>
        </div>

        {/* Card Stack - takes remaining space */}
        <div className="relative z-10 min-h-0 flex-1">
          {isLoadingCommunities ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-lg text-emerald-300">
                Finding best communities...
              </p>
            </div>
          ) : communitiesData?.communities ? (
            <CommunityCardStack communities={communitiesData.communities} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-lg text-emerald-300">No communities found</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
