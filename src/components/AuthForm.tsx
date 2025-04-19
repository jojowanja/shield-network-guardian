
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, LogIn, UserPlus, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

type AuthMode = "login" | "register";

// Initialize Supabase client with fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-public-anon-key';

// Create client only if we have valid URL and key
const supabaseClient = () => {
  if (!supabaseUrl || supabaseUrl === 'https://your-supabase-project-url.supabase.co') {
    console.warn('Supabase URL is not configured. Using demo mode.');
    return null;
  }
  return createClient(supabaseUrl, supabaseKey);
};

const supabase = supabaseClient();

export const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleDemoLogin = () => {
    // If Supabase is not configured, use demo mode
    if (!supabase) {
      toast({
        title: "Demo mode activated",
        description: "Logging in with a demo account"
      });
      
      // Save demo user to localStorage for persistence
      localStorage.setItem("demo_mode", "true");
      
      // Redirect to dashboard
      navigate("/overview");
      return true;
    }
    return false;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Try demo mode first
      if (handleDemoLogin()) {
        setIsLoading(false);
        return;
      }
      
      // Password validation
      if (mode === "register" && password !== confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "Please make sure your passwords match",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Password strength check
      if (password.length < 8) {
        toast({
          title: "Weak password",
          description: "Your password should be at least 8 characters long",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      if (mode === "login") {
        // Handle login with Supabase
        const { data, error } = await supabase!.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        toast({
          title: "Logged in successfully",
          description: "Welcome back!"
        });
        
        // Save user session to local storage for persistence
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Redirect to dashboard
        navigate("/overview");
      } else {
        // Handle registration with Supabase
        const { data, error } = await supabase!.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/auth"
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "Registration successful",
          description: data.user ? "Account created successfully!" : "Please check your email to verify your account"
        });
        
        if (data.user && !data.session) {
          // If email confirmation is required
          toast({
            title: "Email verification required",
            description: "Please check your inbox to verify your email address"
          });
        } else if (data.session) {
          // If auto-confirmation is enabled
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/overview");
        }
      }
      
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-shield-accent/20 flex items-center justify-center text-shield-accent">
              <Shield size={32} />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === "login" 
              ? "Sign in to access your network dashboard" 
              : "Register to start monitoring your network"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {mode === "login" ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  {mode === "login" ? "Sign in" : "Create account"}
                </span>
              )}
            </Button>
            
            {!supabase && (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => handleDemoLogin()}
              >
                Continue in Demo Mode
              </Button>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          </div>
          <Button 
            variant="outline" 
            className="w-full" 
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Create an account" : "Sign in instead"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
