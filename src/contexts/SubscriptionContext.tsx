import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type PlanType = 'home' | 'school' | 'work';
export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'enterprise';

interface SubscriptionContextType {
  isPremium: boolean;
  subscriptionTier: SubscriptionTier;
  planType: PlanType;
  subscriptionEnd: string | null;
  isLoading: boolean;
  checkSubscription: () => Promise<void>;
  upgradeSubscription: (tier: SubscriptionTier) => Promise<void>;
  setPlanType: (plan: PlanType) => void;
  getThemeClass: () => string;
  hasFeatureAccess: (feature: string) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isPremium: false,
  subscriptionTier: 'free',
  planType: 'home',
  subscriptionEnd: null,
  isLoading: false,
  checkSubscription: async () => {},
  upgradeSubscription: async () => {},
  setPlanType: () => {},
  getThemeClass: () => '',
  hasFeatureAccess: () => false,
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free');
  const [planType, setPlanTypeState] = useState<PlanType>('home');
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const featureAccess = {
    // Basic features (available to all)
    'device-list': true,
    'speed-test': true,
    'basic-monitoring': true,
    
    // Premium features (home plan)
    'smart-suggestions': ['premium', 'enterprise'],
    'optimization-tips': ['premium', 'enterprise'],
    'guest-wifi': ['premium', 'enterprise'],
    'auto-disconnect': ['premium', 'enterprise'],
    'ai-advice': ['premium', 'enterprise'],
    'weekly-reports': ['premium', 'enterprise'],
    'premium-theme': ['premium', 'enterprise'],
    'multi-location': ['premium', 'enterprise'],
    
    // School specific features
    'content-filtering': ['premium', 'enterprise'],
    'classroom-segmentation': ['premium', 'enterprise'],
    'student-analytics': ['premium', 'enterprise'],
    'access-controls': ['premium', 'enterprise'],
    
    // Work/Enterprise features
    'threat-detection': ['premium', 'enterprise'],
    'vpn-integration': ['premium', 'enterprise'],
    'productivity-insights': ['premium', 'enterprise'],
    'compliance-reporting': ['enterprise'],
    'enterprise-support': ['enterprise'],
  };

  const checkSubscription = async () => {
    setIsLoading(true);
    try {
      // For demo purposes, let's simulate different subscription states
      // In a real app, this would call your backend API
      const demoUsers = {
        'premium@home.com': { tier: 'premium' as SubscriptionTier, plan: 'home' as PlanType },
        'premium@school.com': { tier: 'premium' as SubscriptionTier, plan: 'school' as PlanType },
        'premium@work.com': { tier: 'premium' as SubscriptionTier, plan: 'work' as PlanType },
      };
      
      // For demo, just set premium if localStorage has a demo flag
      const demoMode = localStorage.getItem('demo-premium');
      if (demoMode) {
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

  const upgradeSubscription = async (tier: SubscriptionTier) => {
    setIsLoading(true);
    try {
      console.log(`Upgrading to ${tier} plan for ${planType}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (tier !== 'free') {
        setIsPremium(true);
        setSubscriptionTier(tier);
        setSubscriptionEnd(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
        localStorage.setItem('demo-premium', 'true');
      } else {
        setIsPremium(false);
        setSubscriptionTier('free');
        setSubscriptionEnd(null);
        localStorage.removeItem('demo-premium');
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setPlanType = (plan: PlanType) => {
    setPlanTypeState(plan);
    localStorage.setItem('selected-plan', plan);
  };

  const getThemeClass = () => {
    if (isPremium) {
      return 'premium-theme bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800';
    }
    return 'basic-theme bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800';
  };

  const hasFeatureAccess = (feature: string) => {
    const allowedTiers = featureAccess[feature as keyof typeof featureAccess];
    if (typeof allowedTiers === 'boolean') return allowedTiers;
    if (Array.isArray(allowedTiers)) {
      return allowedTiers.includes(subscriptionTier);
    }
    return false;
  };

  // Apply theme to body when subscription changes
  useEffect(() => {
    const applyTheme = () => {
      const body = document.body;
      // Remove existing theme classes
      body.classList.remove('basic-theme', 'premium-theme');
      
      // Apply new theme
      if (isPremium) {
        body.classList.add('premium-theme');
      } else {
        body.classList.add('basic-theme');
      }
    };
    
    applyTheme();
  }, [isPremium, subscriptionTier]);

  useEffect(() => {
    checkSubscription();
    
    // Load saved plan type
    const savedPlan = localStorage.getItem('selected-plan') as PlanType;
    if (savedPlan && ['home', 'school', 'work'].includes(savedPlan)) {
      setPlanTypeState(savedPlan);
    }
  }, []);

  const value = {
    isPremium,
    subscriptionTier,
    planType,
    subscriptionEnd,
    isLoading,
    checkSubscription,
    upgradeSubscription,
    setPlanType,
    getThemeClass,
    hasFeatureAccess,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};