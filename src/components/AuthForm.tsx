
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { PasswordStrengthChecker } from "@/components/PasswordStrengthChecker";
import { checkPasswordStrength } from "@/utils/passwordUtils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const { signIn, isLoading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const isFormLoading = isLoading || authLoading;

  const passwordStrength = checkPasswordStrength(password);
  const isPasswordValid = passwordStrength.score >= 2; // Minimum medium strength

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
      toast({
        title: "Login successful",
        description: "Welcome back to Shield Network Guardian!",
      });
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      toast({
        title: "Password too weak",
        description: "Please choose a stronger password (minimum medium strength).",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are identical.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // In demo mode, simulate registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Registration successful",
        description: "Welcome to Shield Network Guardian! Please log in.",
      });
      setActiveTab("login");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // In demo mode, simulate password reset
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Password reset sent",
        description: "Check your email for password reset instructions.",
      });
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Password reset failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already logged in, redirect
  if (user) {
    navigate("/");
    return null;
  }

  if (showForgotPassword) {
    return (
      <Card className="w-full backdrop-blur-sm bg-white/10 border-white/20 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">Reset Password</CardTitle>
          <CardDescription className="text-blue-200">
            Enter your email to receive reset instructions
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleForgotPassword}>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-white">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="you@example.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-blue-400"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white shadow-lg" 
              disabled={isFormLoading}
            >
              {isFormLoading ? "Sending..." : "Send Reset Email"}
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              className="text-blue-200 hover:text-white"
              onClick={() => setShowForgotPassword(false)}
            >
              Back to Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    );
  }

  return (
    <Card className="w-full backdrop-blur-sm bg-white/10 border-white/20 shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-white">Secure Access</CardTitle>
        <CardDescription className="text-blue-200">
          Authenticate to access your Shield dashboard
        </CardDescription>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full bg-white/10 border-white/20">
          <TabsTrigger value="login" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-blue-200">
            Login
          </TabsTrigger>
          <TabsTrigger value="register" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-blue-200">
            Register
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <button 
                    type="button"
                    className="text-sm text-blue-300 hover:text-blue-200 hover:underline"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-blue-400"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white shadow-lg" 
                disabled={isFormLoading}
              >
                {isFormLoading ? "Authenticating..." : "Secure Login"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
        
        <TabsContent value="register">
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-white">Email</Label>
                <Input 
                  id="signup-email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-white">Password</Label>
                <Input 
                  id="signup-password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-blue-400"
                />
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-200">Strength:</span>
                      <span className={`text-sm font-medium ${
                        passwordStrength.score >= 3 ? 'text-green-300' : 
                        passwordStrength.score >= 2 ? 'text-yellow-300' : 'text-red-300'
                      }`}>
                        {passwordStrength.score === 0 ? 'Very Weak' :
                         passwordStrength.score === 1 ? 'Weak' :
                         passwordStrength.score === 2 ? 'Medium' :
                         passwordStrength.score === 3 ? 'Strong' : 'Very Strong'}
                      </span>
                    </div>
                    {!isPasswordValid && (
                      <Alert className="bg-red-500/20 border-red-400/50">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-red-200">
                          Password must be at least medium strength
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-white">Confirm Password</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-blue-400"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white shadow-lg" 
                disabled={isFormLoading || !isPasswordValid}
              >
                {isFormLoading ? "Creating Account..." : "Create Secure Account"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
