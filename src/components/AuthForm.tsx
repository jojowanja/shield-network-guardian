
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

export const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, isLoading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const isFormLoading = isLoading || authLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
      toast({
        title: "Login successful",
        description: "Welcome back to Shield!",
      });
      navigate("/welcome");
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

  // If user is already logged in, redirect to welcome
  if (user) {
    navigate("/welcome");
    return null;
  }

  return (
    <Card className="w-full backdrop-blur-sm bg-white/10 border-white/20 shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-white">Secure Access</CardTitle>
        <CardDescription className="text-blue-200">
          Authenticate to access your Shield dashboard
        </CardDescription>
      </CardHeader>
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid grid-cols-2 w-full bg-white/10 border-white/20">
          <TabsTrigger value="login" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-blue-200">
            Login
          </TabsTrigger>
          <TabsTrigger value="register" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-blue-200">
            Register
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <form onSubmit={handleSubmit}>
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
                  <a href="#" className="text-sm text-blue-300 hover:text-blue-200 hover:underline">
                    Forgot password?
                  </a>
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
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-white">Email</Label>
              <Input 
                id="signup-email" 
                type="email" 
                placeholder="you@example.com" 
                required 
                className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-blue-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password" className="text-white">Password</Label>
              <Input 
                id="signup-password" 
                type="password" 
                required 
                className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-blue-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-white">Confirm Password</Label>
              <Input 
                id="confirm-password" 
                type="password" 
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
              {isFormLoading ? "Creating Account..." : "Create Secure Account"}
            </Button>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
