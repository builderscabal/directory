"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Trash, UserPlus, UserX, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GradientHeading } from "@/components/cabal-ui/gradient-heading";
import { StyledButton } from "@/components/cabal-ui/submit-button";
import { startupSchema } from "../../../../../../constants/schema";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "convex/react";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { UploadIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { sectors } from "@/constants/sectorsData";
import Link from "next/link";
import MDEditor from "@uiw/react-md-editor";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type FileExtension =
  | "jpg"
  | "jpeg"
  | "png"
  | "gif"
  | "bmp"
  | "tiff"
  | "webp"
  | "svg"
  | "heif";

interface StartupProps {
  startupId: Id<"startups">;
}

interface Social {
  name: string;
  label: string;
}

const availableSocials: Social[] = [
  { name: "twitter", label: "Twitter/X" },
  { name: "linkedin", label: "LinkedIn" },
  { name: "facebook", label: "Facebook" },
  { name: "instagram", label: "Instagram" },
  { name: "youtube", label: "YouTube" },
];

export const EditStartupForm = ({ startupId }: StartupProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [selectedSocials, setSelectedSocials] = useState<string[]>([]);
  const [socialUsernames, setSocialUsernames] = useState<
    Record<string, string>
  >({});

  //logo
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoId, setLogoId] = useState<Id<"_storage"> | null>(null);
  const [logoFileUrl, setLogoFileUrl] = useState("");

  //display image
  const [selectedDisplay, setSelectedDisplay] = useState<File | null>(null);
  const [uploadingDisplay, setUploadingDisplay] = useState(false);
  const [displayId, setDisplayId] = useState<Id<"_storage"> | null>(null);
  const [displayFileUrl, setDisplayFileUrl] = useState("");

  const [issues, setIssues] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  const [logoSizeError, setLogoSizeError] = useState<boolean>(false);
  const [displaySizeError, setDisplaySizeError] = useState<boolean>(false);

  const [selectedStartupAge, setSelectedStartupAge] = useState<string>("");
  const [selectedTeamSize, setSelectedTeamSize] = useState<string>("");
  const [selectedStartupStage, setSelectedStartupStage] = useState<string>("");

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl, {
    onUploadProgress: (progress: any) => setUploadProgress(progress),
  });

  const getFileUrl = useMutation(api.users.getUrl);

  const startup = useQuery(api.startups.getStartupById, {
    startupId,
  });

  const updateStartup = useMutation(api.startups.updateStartup);
  const saveSector = useMutation(api.sectors.saveSector);
  const saveCategory = useMutation(api.categories.saveCategory);
  const saveIndustry = useMutation(api.industries.saveIndustry);

  const deleteLogoFromStorage = useMutation(api.startups.deleteLogo);
  const deleteDisplayFromStorage = useMutation(api.startups.deleteDisplayImage);

  const startupAgeOptions = [
    { id: "below_1_year", name: "Less than 1 year" },
    { id: "1_5_years", name: "1-5 years" },
    { id: "6_10_years", name: "6-10 years" },
    { id: "above_10_years", name: "More than 10 years" },
    { id: "does_not_apply", name: "Not applicable" },
  ];

  const teamSizeOptions = [
    { id: "solo_founder", name: "Solo Founder" },
    { id: "2_10", name: "2-10 Members" },
    { id: "11_20", name: "11-20 Members" },
    { id: "21_30", name: "21-30 Members" },
    { id: "31_40", name: "31-40 Members" },
    { id: "above_40", name: "More than 40 Members" },
  ];

  const startupStageOptions = [
    { id: "idea", name: "Idea Stage" },
    { id: "pre_mvp", name: "Pre-MVP" },
    { id: "mvp", name: "MVP Launched" },
    { id: "growth", name: "Growth Stage" },
  ];

  const form = useForm<z.output<typeof startupSchema>>({
    resolver: zodResolver(startupSchema),
    mode: "onChange",
    defaultValues: {
      contact_email: "",
      name: "",
      tagline: "",
      url: "",
      description: "",
      logoUrl: "",
      displayImageUrl: "",
      sector: "",
      category: "",
      industry: "",
      founders: [],
    },
  });

  useEffect(() => {
    if (startup) {
      const startupFounders =
        Array.isArray(startup.founders) && startup.founders.length > 0
          ? startup.founders
          : [""];
      form.reset({
        ...startup,
        founders: startupFounders,
      });
      setFounders(startupFounders as [string, ...string[]]);

      if (startup?.startupAge) {
        setSelectedStartupAge(startup?.startupAge);
      }

      if (startup?.teamSize) {
        setSelectedTeamSize(startup?.teamSize);
      }

      if (startup?.startupStage) {
        setSelectedStartupStage(startup?.startupStage);
      }

      if (startup?.logoUrl) {
        const fetchImage = async () => {
          try {
            const response = await fetch(startup.logoUrl as string);
            const blob = await response.blob();
            const file = new File([blob], "logoUrl", { type: blob.type });
            setSelectedLogo(file);
          } catch (error) {
            console.error("Error loading startup logo:", error);
          }
        };

        fetchImage();
      } else {
        setSelectedLogo(null);
      }

      if (startup.displayImageUrl) {
        const fetchDisplayImage = async () => {
          try {
            const response = await fetch(startup.displayImageUrl as string);
            const blob = await response.blob();
            const file = new File([blob], "displayImageUrl", {
              type: blob.type,
            });
            setSelectedDisplay(file);
          } catch (error) {
            console.error("Error loading startup display image:", error);
          }
        };

        fetchDisplayImage();
      } else {
        setSelectedDisplay(null);
      }

      const socialPlatforms: Array<keyof typeof startup> = [
        "twitter",
        "linkedin",
        "facebook",
        "instagram",
        "youtube",
      ];

      const initialSocials = socialPlatforms.filter(
        (platform) => startup[platform]
      );
      const initialUsernames = Object.fromEntries(
        initialSocials.map((platform) => [
          platform,
          startup[platform] as string,
        ])
      );

      setSelectedSocials(initialSocials as string[]);
      setSocialUsernames(initialUsernames);
    }
  }, [startup, form]);

  const [founders, setFounders] = useState<[string, ...string[]]>([""]);

  const handleFounderChange = (index: number, value: string) => {
    const newFounders = [...founders];
    newFounders[index] = value;
    setFounders(newFounders as [string, ...string[]]);
    form.setValue("founders", newFounders as [string, ...string[]], {
      shouldValidate: true,
    });
  };

  const addFounder = () => {
    const newFounders = [...founders, ""];
    setFounders(newFounders as [string, ...string[]]);
    form.setValue("founders", newFounders as [string, ...string[]]);
  };

  const removeFounder = (index: number) => {
    if (founders.length > 1) {
      const newFounders = founders.filter((_, i) => i !== index) as [
        string,
        ...string[]
      ];
      setFounders(newFounders);
      form.setValue("founders", newFounders);
    }
  };

  const { handleSubmit } = form;

  useEffect(() => {
    if (message) {
      toast({
        title: "Success",
        description: message,
        variant: "destructive",
      });
    }
    if (issues.length > 0) {
      toast({
        title: "Error",
        description: issues.join(", "),
        variant: "destructive",
      });
      setLoading(false);
    }
    setLoading(false);
  }, [message, issues]);

  const handleSectorChange = (selectedSector: string) => {
    form.setValue("category", "");
    form.setValue("sector", selectedSector);
  };

  const handleSelectSocial = (value: string): void => {
    if (!selectedSocials.includes(value)) {
      setSelectedSocials((prev) => [...prev, value]);
      setSocialUsernames((prev) => ({ ...prev, [value]: "" }));
    }
  };

  const handleRemoveSocial = (social: string): void => {
    setSelectedSocials((prev) => prev.filter((s) => s !== social));
    const newUsernames = { ...socialUsernames };
    delete newUsernames[social];
    setSocialUsernames(newUsernames);
  };

  const handleUsernameChange = (social: string, username: string): void => {
    setSocialUsernames((prev) => ({ ...prev, [social]: username }));
  };

  const getMimeType = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase() as
      | FileExtension
      | undefined;

    const mimeTypes: Record<FileExtension, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      bmp: "image/bmp",
      tiff: "image/tiff",
      webp: "image/webp",
      svg: "image/svg+xml",
      heif: "image/heif",
    };

    return mimeTypes[extension as FileExtension] || "application/octet-stream";
  };

  const uploadLogoImage = async (blob: Blob, fileName: string) => {
    setUploadingLogo(true);
    setUploadProgress(0);
    try {
      const mimeType = getMimeType(fileName);
      const file = new File([blob], fileName, { type: mimeType });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setLogoId(storageId);

      const fileUrl = await getFileUrl({ storageId });
      setLogoFileUrl(fileUrl as string);
      form.setValue("logoUrl", fileUrl as string, { shouldValidate: true });
      toast({
        title: "Success",
        description: "Logo uploaded successfully!",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Error uploading logo",
        variant: "destructive",
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const uploadDisplayImage = async (blob: Blob, fileName: string) => {
    setUploadingDisplay(true);
    setUploadProgress(0);
    try {
      const mimeType = getMimeType(fileName);
      const file = new File([blob], fileName, { type: mimeType });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setDisplayId(storageId);

      const fileUrl = await getFileUrl({ storageId });
      setDisplayFileUrl(fileUrl as string);
      form.setValue("displayImageUrl", fileUrl as string, {
        shouldValidate: true,
      });
      toast({
        title: "Success",
        description: "Display image uploaded successfully!",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Error uploading display image",
        variant: "destructive",
      });
    } finally {
      setUploadingDisplay(false);
    }
  };

  const MAX_LOGO_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const MAX_DISPLAY_FILE_SIZE = 6 * 1024 * 1024; // 6MB

  const handleLogoFile = async (file: File) => {
    if (file.size > MAX_LOGO_FILE_SIZE) {
      setLogoSizeError(true);
      return;
    }

    setSelectedLogo(file);
    const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));
    await uploadLogoImage(blob, file.name);
  };

  const handleDisplayFile = async (file: File) => {
    if (file.size > MAX_DISPLAY_FILE_SIZE) {
      setDisplaySizeError(true);
      return;
    }

    setSelectedDisplay(file);
    const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));
    await uploadDisplayImage(blob, file.name);
  };

  const onUpdateStartupAction = async (data: z.infer<typeof startupSchema>) => {
    if (data.sector) {
      await saveSector({
        name: data.sector,
      });
    }

    if (data.category) {
      await saveCategory({
        name: data.category,
      });
    }

    if (data.industry) {
      await saveIndustry({
        name: data.industry,
      });
    }

    try {
      if (
        (logoId && logoId !== startup?.logoStorageId) ||
        (logoFileUrl && logoFileUrl !== startup?.logoUrl)
      ) {
        if (startup?.logoStorageId && logoFileUrl && logoId) {
          await deleteLogoFromStorage({
            logoStorageId: startup.logoStorageId as Id<"_storage">,
          });
        }
      }

      if (
        (displayId && displayId !== startup?.displayImageStorageId) ||
        (displayFileUrl && displayFileUrl !== startup?.displayImageUrl)
      ) {
        if (startup?.displayImageStorageId && displayFileUrl && displayId) {
          await deleteDisplayFromStorage({
            displayImageStorageId:
              startup.displayImageStorageId as Id<"_storage">,
          });
        }
      }

      let founders = data.founders
        .map((f) => f.trim().toLowerCase())
        .filter((f) => f !== "");

      const filteredSocialUsernames = {
        twitter: selectedSocials.includes("twitter")
          ? socialUsernames.twitter?.trim()
          : "",
        linkedin: selectedSocials.includes("linkedin")
          ? socialUsernames.linkedin?.trim()
          : "",
        instagram: selectedSocials.includes("instagram")
          ? socialUsernames.instagram?.trim()
          : "",
        facebook: selectedSocials.includes("facebook")
          ? socialUsernames.facebook?.trim()
          : "",
        youtube: selectedSocials.includes("youtube")
          ? socialUsernames.youtube?.trim()
          : "",
      };

      const updateData = {
        startupId,
        founders: founders.length > 0 ? founders : startup?.founders,
        contact_email: data.contact_email?.trim() || startup?.contact_email,
        name: data.name?.trim() || startup?.name,
        routing_name: data.name
          ? data.name.replace(/\s+/g, "").toLowerCase()
          : startup?.routing_name,
        url: data.url?.trim() || startup?.url,
        tagline: data.tagline?.trim() || startup?.tagline,
        description: data.description?.trim() || startup?.description,
        logoUrl: logoFileUrl || startup?.logoUrl,
        logoStorageId: logoId !== null ? logoId : startup?.logoStorageId,
        displayImageUrl: displayFileUrl || startup?.displayImageUrl,
        displayImageStorageId:
          displayId !== null ? displayId : startup?.displayImageStorageId,
        ...filteredSocialUsernames,
        sector: data.sector || startup?.sector,
        category: data.category || startup?.category,
        industry: data.industry || startup?.industry,
        startupAge: selectedStartupAge,
        teamSize: selectedTeamSize,
        startupStage: selectedStartupStage,
      };

      await updateStartup(updateData);

      toast({
        title: "Success",
        description: "Startup update is successful!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to update startup.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: z.infer<typeof startupSchema>) => {
    setLoading(true);
    try {
      await onUpdateStartupAction(data);
      router.push("/dashboard");
    } catch (error: any) {
      setIssues([`Submission failed: ${error.message}`]);
    } finally {
      setLoading(false);
    }
  };

  const theme = localStorage.getItem("theme") || "light";

  return (
    <Form {...form}>
      {issues.length > 0 && (
        <div className="text-red-500">
          <ul>
            {issues.map((issue, index) => (
              <li key={index} className="flex gap-1">
                <X fill="red" />
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4 md:p-8 p-0">
          <div className="flex items-center justify-between space-y-2">
            <Link
              href="/dashboard"
              className="inline-flex hover:underline text-lg sm:text-xl font-bold tracking-tight"
            >
              <ArrowLeft className="h-4 w-4 mr-1 mt-1" />
              _back
            </Link>
            <div className="hidden sm:flex items-center space-x-2">
              <StyledButton
                disabled={loading || uploadingLogo || uploadingDisplay}
                type="submit"
                form="startupForm"
              >
                Update
              </StyledButton>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="grid gap-4 grid-cols-1">
                <div className="">
                  <form
                    id="startupForm"
                    ref={formRef}
                    className="space-y-8"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <GradientHeading size="xs">
                      Update: {startup?.name}
                    </GradientHeading>

                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {founders.map((founder, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <FormField
                            control={form.control}
                            name={`founders.${index}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Founder {index + 1}</FormLabel>
                                <FormControl>
                                  <Input
                                    className="capitalize"
                                    placeholder="Founder's name"
                                    value={founder}
                                    onChange={(e) =>
                                      handleFounderChange(index, e.target.value)
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="inline-flex space-x-2">
                            <UserX
                              onClick={() => removeFounder(index)}
                              className="text-red-500 mt-8 cursor-pointer"
                            />
                            {index === 0 && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <UserPlus
                                      onClick={addFounder}
                                      className="hover:text-blue-500 mt-8 cursor-pointer"
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent className="mb-2">
                                    <p>Click to add a new founder</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <FormField
                      control={form.control}
                      name="logoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Startup Logo</FormLabel>
                          <FormControl>
                            <div>
                              <div
                                className="border-2 max-w-[100px] sm:max-w-[150px] border-dashed border-gray-200 dark:border-gray-800 rounded-lg p-4 flex justify-center items-center cursor-pointer"
                                onClick={() =>
                                  document
                                    .getElementById("logo-file-upload")
                                    ?.click()
                                }
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                onDragLeave={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const files = e.dataTransfer.files;
                                  if (files.length > 0) {
                                    const file = files[0];
                                    if (file.size > MAX_LOGO_FILE_SIZE) {
                                      setLogoSizeError(true);
                                      return;
                                    }
                                    handleLogoFile(file);
                                  }
                                }}
                              >
                                {selectedLogo ? (
                                  <Image
                                    src={URL.createObjectURL(selectedLogo)}
                                    alt="Selected Image"
                                    width={150}
                                    height={150}
                                    className="rounded-lg object-cover"
                                  />
                                ) : (
                                  <span className="text-gray-500">
                                    Drag {`'n'`} drop or click to upload
                                  </span>
                                )}
                              </div>
                              <Input
                                id="logo-file-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (file.size > MAX_LOGO_FILE_SIZE) {
                                      setLogoSizeError(true);
                                      return;
                                    }
                                    handleLogoFile(file);
                                  }
                                }}
                              />
                              <div className="relative w-full mt-2">
                                {uploadingLogo && (
                                  <>
                                    <p className="text-sm">Uploading logo...</p>
                                    <Progress
                                      value={uploadProgress}
                                      className="mt-1"
                                    />
                                  </>
                                )}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage>
                            {logoSizeError ? (
                              <span className="text-red-500 ml-1 text-xs">
                                File size exceeds 2 MB. Please upload a smaller
                                file.
                              </span>
                            ) : null}
                          </FormMessage>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label
                          htmlFor="startupAge"
                          className="block mb-1 text-sm"
                        >
                          How long has it been operating?
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setSelectedStartupAge(value)
                          }
                          value={selectedStartupAge}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select startup age" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {startupAgeOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="teamSize" className="mt-4 text-sm">
                          What is your current team size?
                        </Label>
                        <Select
                          onValueChange={(value) => setSelectedTeamSize(value)}
                          value={selectedTeamSize}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select team size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {teamSizeOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="startupStage" className="mt-4 text-sm">
                          Which stage is it in?
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setSelectedStartupStage(value)
                          }
                          value={selectedStartupStage}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select startup stage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {startupStageOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="contact_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter contact email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Startup Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="What's your startup called?"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tagline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Startup Tagline (~50 characters)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your startup's tagline"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <FormDescription>
                            E.g: Flutterwave - Endless possibilities for every
                            business.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Startup Website</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your startup website url"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Elevator Pitch/Description (~1,000 characters)
                          </FormLabel>
                          <FormControl>
                            <MDEditor
                              {...field}
                              id="description"
                              preview="edit"
                              height={150}
                              style={{
                                borderRadius: 10,
                                overflow: "hidden",
                                backgroundColor:
                                  theme === "dark" ? "#333333" : "#FFFFFF",
                                color: theme === "dark" ? "#FFFFFF" : "#000000",
                              }}
                              textareaProps={{
                                placeholder:
                                  "Tell us about what you have built or are currently building...",
                              }}
                              previewOptions={{
                                disallowedElements: ["style"],
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sector"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Startup Sector</FormLabel>
                          <Select
                            onValueChange={(value: any) => {
                              handleSectorChange(value);
                            }}
                            defaultValue={field.value}
                            {...field}
                          >
                            <FormControl>
                              <SelectTrigger>
                                {field.value ? (
                                  <SelectValue>
                                    <span className="capitalize">
                                      {field.value}
                                    </span>
                                  </SelectValue>
                                ) : (
                                  <span className="placeholder">
                                    Select a sector
                                  </span>
                                )}
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sectors.map((sector) => (
                                <SelectItem
                                  key={sector.label}
                                  value={sector.value.toLowerCase()}
                                >
                                  {sector.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Enter the sector that your startup operates in.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Conditional rendering of categories select based on selected sector */}
                    {form.watch("sector") && (
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              {...field}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  {field.value ? (
                                    <SelectValue>
                                      <span className="capitalize">
                                        {field.value}
                                      </span>
                                    </SelectValue>
                                  ) : (
                                    <span className="placeholder">
                                      Select a category
                                    </span>
                                  )}
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {sectors
                                  .find(
                                    (sector) =>
                                      sector.value === form.watch("sector")
                                  )
                                  ?.categories.map((category) => (
                                    <SelectItem
                                      key={category.value}
                                      value={category.value}
                                    >
                                      {category.label}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Conditional rendering of industries select based on selected category */}
                    {form.watch("category") && (
                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              {...field}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  {field.value ? (
                                    <SelectValue>
                                      <span className="capitalize">
                                        {field.value}
                                      </span>
                                    </SelectValue>
                                  ) : (
                                    <span className="placeholder">
                                      Select an industry
                                    </span>
                                  )}
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {sectors
                                  .find(
                                    (sector) =>
                                      sector.value === form.watch("sector")
                                  )
                                  ?.categories.find(
                                    (category) =>
                                      category.value === form.watch("category")
                                  )
                                  ?.industries.map((industry) => (
                                    <SelectItem key={industry} value={industry}>
                                      {industry}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div>
                      {/* Social Media Selection */}
                      <div className="mb-4">
                        <Select
                          onValueChange={handleSelectSocial}
                          defaultValue=""
                        >
                          <SelectTrigger className="w-full sm:w-auto">
                            <span>Add Social Media Handles</span>
                          </SelectTrigger>
                          <SelectContent>
                            {availableSocials
                              .filter(
                                (social) =>
                                  !selectedSocials.includes(social.name)
                              )
                              .map((social) => (
                                <SelectItem
                                  key={social.name}
                                  value={social.name}
                                >
                                  {social.label}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground mt-1">
                          When adding your socials, kindly add ONLY the
                          usernames
                        </p>
                      </div>

                      {/* Display Existing Social Handles with Inputs */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {selectedSocials.map((social) => (
                          <div key={social} className="flex flex-col">
                            <label className="text-sm font-medium">
                              {
                                availableSocials.find((s) => s.name === social)
                                  ?.label
                              }
                            </label>
                            <div className="inline-flex">
                              <Input
                                placeholder="username"
                                value={socialUsernames[social] || ""}
                                onChange={(e) =>
                                  handleUsernameChange(social, e.target.value)
                                }
                                className="mt-1"
                              />
                              <Trash
                                onClick={() => handleRemoveSocial(social)}
                                className="text-red-500 mt-3 ml-1 cursor-pointer"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="displayImageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Display Image (.jpg or .png format)
                          </FormLabel>
                          <FormControl>
                            <div>
                              <div
                                className="group relative grid h-[400px] w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25"
                                onClick={() =>
                                  document
                                    .getElementById("display-file-upload")
                                    ?.click()
                                }
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                onDragLeave={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const files = e.dataTransfer.files;
                                  if (files.length > 0) {
                                    const file = files[0];
                                    if (file.size > MAX_DISPLAY_FILE_SIZE) {
                                      setDisplaySizeError(true);
                                      return;
                                    }
                                    handleDisplayFile(file);
                                  }
                                }}
                              >
                                {selectedDisplay ? (
                                  <Image
                                    src={URL.createObjectURL(selectedDisplay)}
                                    alt="Selected Image"
                                    width={150}
                                    height={150}
                                    className="w-full h-[360px] rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                                    <div className="rounded-full border border-dashed p-3">
                                      <UploadIcon
                                        className="size-7 text-muted-foreground"
                                        aria-hidden="true"
                                      />
                                    </div>
                                    <div className="space-y-px">
                                      <p className="font-medium text-muted-foreground">
                                        Drag {`'n'`} drop or click to upload
                                      </p>
                                      <p className="text-sm text-muted-foreground/70">
                                        You can upload a image with a max size
                                        of 6 MB
                                      </p>
                                      {displaySizeError ? (
                                        <span className="text-red-500 text-xs">
                                          File size exceeds 6 MB. Please upload
                                          a smaller file.
                                        </span>
                                      ) : null}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <Input
                                id="display-file-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (file.size > MAX_DISPLAY_FILE_SIZE) {
                                      setDisplaySizeError(true);
                                      return;
                                    }
                                    handleDisplayFile(file);
                                  }
                                }}
                              />
                              <div className="relative w-full mt-2">
                                {uploadingDisplay && (
                                  <>
                                    <p className="text-sm">
                                      Uploading display image...
                                    </p>
                                    <Progress
                                      value={uploadProgress}
                                      className="mt-1"
                                    />
                                  </>
                                )}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex sm:hidden">
                      <StyledButton
                        disabled={loading || uploadingLogo || uploadingDisplay}
                        type="submit"
                        form="startupForm"
                      >
                        Update
                      </StyledButton>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default EditStartupForm;