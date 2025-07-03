import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, AlertCircle, CheckCircle, Mail } from "lucide-react";
import { checkPasswordStrength } from "@/utils/passwordUtils";

// Enhanced password validation schema
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const AuthForm = () => {
  const [activeTab, setActiveTab] = useState("register");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<any>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" }
  });

  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" }
  });

  const handleLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      console.log('Attempting login for:', data.email);
      
      await signIn(data.email, data.password);
      
      toast.success("Welcome back!", {
        description: "You have successfully signed in."
      });

      navigate("/");
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = "Sign in failed. Please check your credentials.";
      
      if (error.message?.includes("Please check your email")) {
        errorMessage = error.message;
        setShowEmailConfirmation(true);
        setRegisteredEmail(data.email);
      } else if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      } else if (error.message?.includes("User not found")) {
        errorMessage = "No account found with this email. Please sign up first.";
        setActiveTab("register");
      }
      
      setAuthError(errorMessage);
      toast.error("Sign in failed", {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      console.log('Attempting registration for:', data.email);
      
      const result = await signUp(data.email, data.password);
      
      if (result.error) {
        if (result.error.message?.includes("User already registered")) {
          setAuthError("An account with this email already exists. Please sign in instead.");
          toast.error("Account already exists", {
            description: "Please use the Sign In tab to access your existing account."
          });
          setActiveTab("login");
          return;
        }
        
        throw result.error;
      }
      
      toast.success("Account created successfully!", {
        description: "Please check your email to confirm your account before signing in."
      });
      
      setRegisteredEmail(data.email);
      setShowEmailConfirmation(true);
      registerForm.reset();
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.message?.includes("User already registered")) {
        errorMessage = "An account with this email already exists. Please sign in instead.";
        setActiveTab("login");
      }
      
      setAuthError(errorMessage);
      toast.error("Registration failed", {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      console.log('Password reset attempt for:', data.email);
      
      const result = await resetPassword(data.email);
      
      if (result.error) {
        throw result.error;
      }
      
      toast.success("Reset instructions sent!", {
        description: "Check your email for password reset instructions."
      });
      
      setActiveTab("login");
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      const errorMessage = error.message || "Password reset failed. Please try again or contact support.";
      setAuthError(errorMessage);
      toast.error("Reset failed", {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (password: string) => {
    if (password) {
      const strength = checkPasswordStrength(password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(null);
    }
  };

  const getStrengthColor = (score: number) => {
    switch(score) {
      case 0: return "text-red-500";
      case 1: return "text-orange-500";
      case 2: return "text-yellow-500";
      case 3: return "text-green-500";
      case 4: return "text-green-700";
      default: return "text-gray-500";
    }
  };

  const getStrengthLabel = (score: number) => {
    switch(score) {
      case 0: return "Very Weak";
      case 1: return "Weak";
      case 2: return "Medium";
      case 3: return "Strong";
      case 4: return "Very Strong";
      default: return "";
    }
  };

  if (showEmailConfirmation) {
    return (
      <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">Check Your Email</CardTitle>
          <CardDescription className="text-blue-200">
            We've sent a confirmation link to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6">
            <Mail className="mx-auto h-16 w-16 text-blue-300 mb-4" />
            <p className="text-white mb-2">
              We've sent a confirmation email to:
            </p>
            <p className="text-blue-200 font-medium mb-4">
              {registeredEmail}
            </p>
            <p className="text-sm text-blue-200">
              Click the link in the email to activate your account, then return here to sign in.
            </p>
          </div>
          
          <Button 
            onClick={() => {
              setShowEmailConfirmation(false);
              setActiveTab("login");
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
          >
            Back to Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-white">Welcome to Shield</CardTitle>
        <CardDescription className="text-blue-200">
          {activeTab === "login" ? "Sign in to your account" : activeTab === "register" ? "Create your Shield account" : "Reset your password"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {authError && (
          <Alert className="mb-4 bg-red-500/10 border-red-500/20">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              {authError}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10">
            <TabsTrigger value="register" className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-900">
              Register
            </TabsTrigger>
            <TabsTrigger value="login" className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-900">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="forgot" className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-900">
              Reset
            </TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="space-y-4 mt-6">
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-email" className="text-white">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                  {...registerForm.register("email")}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-red-400 text-sm">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 pr-10"
                    {...registerForm.register("password", {
                      onChange: (e) => handlePasswordChange(e.target.value)
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-red-400 text-sm">{registerForm.formState.errors.password.message}</p>
                )}
                
                {passwordStrength && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-200">Strength:</span>
                      <span className={`text-sm font-medium ${getStrengthColor(passwordStrength.score)}`}>
                        {getStrengthLabel(passwordStrength.score)}
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          passwordStrength.score >= 3 ? 'bg-green-500' : 
                          passwordStrength.score >= 2 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(passwordStrength.score + 1) * 20}%` }}
                      />
                    </div>
                    {passwordStrength.feedback.suggestions.length > 0 && (
                      <div className="text-xs text-blue-200">
                        {passwordStrength.feedback.suggestions[0]}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-white">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 pr-10"
                    {...registerForm.register("confirmPassword")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-red-400 text-sm">{registerForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="login" className="space-y-4 mt-6">
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                  {...loginForm.register("email")}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-red-400 text-sm">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 pr-10"
                    {...loginForm.register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-red-400 text-sm">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="forgot" className="space-y-4 mt-6">
            <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email" className="text-white">Email</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                  {...forgotPasswordForm.register("email")}
                />
                {forgotPasswordForm.formState.errors.email && (
                  <p className="text-red-400 text-sm">{forgotPasswordForm.formState.errors.email.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
