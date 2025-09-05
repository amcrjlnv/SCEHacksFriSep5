import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search, RotateCcw } from "lucide-react";
import { FormField } from "../components/FormField";
import { TokenInput } from "../components/TokenInput";
import { RoleChips } from "../components/RoleChips";
import { InterestChips } from "../components/InterestChips";
import {
  fetchMatches,
  HACKATHONS,
  SKILLS,
  AVAILABILITY_OPTIONS,
  type Profile,
  type Match,
} from "../lib/api";
import { UserProfile, storage } from "../lib/storage";
import { toast } from "@/hooks/use-toast";

export default function MatchForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    hackathon: "",
    name: "",
    contact: "",
    roles: [],
    skills: [],
    interests: [],
    availability: "",
    blurb: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof UserProfile, string>>
  >({});

  // Load saved profile on mount
  useEffect(() => {
    const saved = storage.getProfile();
    if (saved) {
      setFormData(saved);
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserProfile, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.contact.trim()) {
      newErrors.contact = "Contact is required";
    }
    if (!formData.hackathon) {
      newErrors.hackathon = "Please select a hackathon";
    }
    if (formData.roles.length === 0) {
      newErrors.roles = "Select at least one role";
    }
    if (formData.skills.length < 2) {
      newErrors.skills = "Add at least 2 skills";
    }
    if (!formData.availability) {
      newErrors.availability = "Please select your availability";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Check the required fields and try again",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Call backend to get matches
      const matches: Match[] = await fetchMatches(formData as Profile);

      // Save profile and matches locally
      storage.saveProfile(formData);
      storage.saveMatches(matches);

      // Navigate to results page with state
      navigate("/results", {
        state: {
          matches,
          hackathon: formData.hackathon,
        },
      });
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description: error.message ?? "Please try again in a moment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      hackathon: "",
      name: "",
      contact: "",
      roles: [],
      skills: [],
      interests: [],
      availability: "",
      blurb: "",
    });
    setErrors({});
    toast({
      title: "Form cleared",
      description: "All fields have been reset",
    });
  };

  const updateFormData = <K extends keyof UserProfile>(
    key: K,
    value: UserProfile[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Find Your Teammates</CardTitle>
          <CardDescription>
            Tell us about yourself and we'll find the perfect matches for your
            hackathon team
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hackathon */}
            <FormField
              label="Hackathon"
              required
              error={errors.hackathon}
              htmlFor="hackathon"
            >
              <Select
                value={formData.hackathon}
                onValueChange={(value) => updateFormData("hackathon", value)}
              >
                <SelectTrigger id="hackathon">
                  <SelectValue placeholder="Select a hackathon" />
                </SelectTrigger>
                <SelectContent>
                  {HACKATHONS.map((hackathon) => (
                    <SelectItem key={hackathon} value={hackathon}>
                      {hackathon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {/* Name */}
            <FormField label="Name" required error={errors.name} htmlFor="name">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                placeholder="Your name"
              />
            </FormField>

            {/* Contact */}
            <FormField
              label="Contact"
              description="Discord username or email address"
              required
              error={errors.contact}
              htmlFor="contact"
            >
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => updateFormData("contact", e.target.value)}
                placeholder="@username or email@example.com"
              />
            </FormField>

            {/* Roles */}
            <FormField
              label="Roles"
              description="What roles can you fill on a team?"
              required
              error={errors.roles}
              htmlFor="roles"
            >
              <RoleChips
                id="roles"
                value={formData.roles}
                onChange={(value) => updateFormData("roles", value)}
              />
            </FormField>

            {/* Skills */}
            <FormField
              label="Skills"
              description="Add your technical skills (minimum 2)"
              required
              error={errors.skills}
              htmlFor="skills"
            >
              <TokenInput
                id="skills"
                value={formData.skills}
                onChange={(value) => updateFormData("skills", value)}
                suggestions={SKILLS as string[]}
                placeholder="Type a skill and press Enter"
              />
            </FormField>

            {/* Interests */}
            <FormField
              label="Interests"
              description="What domains or causes interest you?"
              htmlFor="interests"
            >
              <InterestChips
                id="interests"
                value={formData.interests}
                onChange={(value) => updateFormData("interests", value)}
              />
            </FormField>

            {/* Availability */}
            <FormField
              label="Availability"
              required
              error={errors.availability}
              htmlFor="availability"
            >
              <Select
                value={formData.availability}
                onValueChange={(value) => updateFormData("availability", value)}
              >
                <SelectTrigger id="availability">
                  <SelectValue placeholder="Select your availability" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABILITY_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {/* Blurb */}
            <FormField
              label="About You"
              description="What do you want to build? What do you bring to the team?"
              htmlFor="blurb"
            >
              <Textarea
                id="blurb"
                value={formData.blurb}
                onChange={(e) => updateFormData("blurb", e.target.value)}
                placeholder="Tell potential teammates about yourself and your goals..."
                className="min-h-[100px]"
              />
            </FormField>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finding Matches...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Find Matches
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={clearForm}
                disabled={loading}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
