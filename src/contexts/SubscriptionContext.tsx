
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

interface SubscriptionContextType {
  isPremium: boolean;
  subscriptionTier: 'free' | 'basic' | 'premium' | 'enterprise';
  subscriptionEnd: string | null;
  isLoading: boolean;
  checkSubscription: () => Promise<void>;
  upgradeSubscription: (tier: string) => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isPremium: false,
  subscriptionTier: 'free',
  subscriptionEnd: null,
  isLoading: false,
  checkSubscription: async () => {},
  upgradeSubscription: async () => {},
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'basic' | 'premium' | 'enterprise'>('free');
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const checkSubscription = async () => {
    if (!user) {
      setIsPremium(false);
      setSubscriptionTier('free');
      setSubscriptionEnd(null);
      return;
    }

    setIsLoading(true);
    try {
      // Mock subscription check - in real app, this would call your backend
      // For demo purposes, let's say demo@example.com has premium access
      if (user.email === 'demo@example.com') {
        setIsPremium(true);
        setSubscriptionTier('premium');
        setSubscriptionEnd(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
      } else {
        setIsPremium(false);
        setSubscriptionTier('free');
        setSubscriptionEnd(null);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setIsPremium(false);
      setSubscriptionTier('free');
    } finally {
      setIsLoading(false);
    }
  };

  const upgradeSubscription = async (tier: string) => {
    setIsLoading(true);
    try {
      // Mock upgrade - in real app, this would integrate with Stripe
      console.log(`Upgrading to ${tier} plan`);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (tier !== 'free') {
        setIsPremium(true);
        setSubscriptionTier(tier as any);
        setSubscriptionEnd(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSubscription();
  }, [user]);

  const value = {
    isPremium,
    subscriptionTier,
    subscriptionEnd,
    isLoading,
    checkSubscription,
    upgradeSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
