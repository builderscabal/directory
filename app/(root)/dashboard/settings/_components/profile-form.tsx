"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GradientHeading } from "@/components/cabal-ui/gradient-heading";
import { StyledButton } from "@/components/cabal-ui/submit-button";
import { userSchema } from "../../../../../constants/schema";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "convex/react";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

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

interface UserProps {
  userId: string;
}

export const ProfileForm = ({ userId }: UserProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [issues, setIssues] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  const [fileStorageId, setFileStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  const [profileFileUrl, setProfileFileUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [profileImageError, setProfileImageError] = useState<boolean>(false);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl, {
    onUploadProgress: (progress: any) => setUploadProgress(progress),
  });

  const getFileUrl = useMutation(api.users.getUrl);

  const profile = useQuery(api.users.getUserByClerkId, {
    clerkId: userId,
  });

  const updateUser = useMutation(api.users.updateUser);

  const form = useForm<z.output<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
    defaultValues: {
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      whatsappNumber: profile?.whatsappNumber?.toString() || "+234",
      twitter: profile?.twitter || "",
      linkedin: profile?.linkedin || "",
      profileImage: profile?.imageUrl || "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile?.firstName || "",
        lastName: profile?.lastName || "",
        whatsappNumber: profile?.whatsappNumber?.toString() || "+234",
        twitter: profile?.twitter || "",
        linkedin: profile?.linkedin || "",
        profileImage: profile?.imageUrl || "",
      });

      if (profile.imageUrl) {
        const fetchImage = async () => {
          try {
            const response = await fetch(profile.imageUrl as string);
            const blob = await response.blob();
            const file = new File([blob], "profileImage", { type: blob.type });
            setSelectedImage(file);
          } catch (error) {
            console.error("Error loading profile image:", error);
          }
        };

        fetchImage();
      }
    }
  }, [profile, form]);

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

  const uploadProfileImage = async (blob: Blob, fileName: string) => {
    setUploadingImage(true);
    setUploadProgress(0);
    try {
      const mimeType = getMimeType(fileName);
      const file = new File([blob], fileName, { type: mimeType });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setFileStorageId(storageId);

      const fileUrl = await getFileUrl({ storageId });
      setProfileFileUrl(fileUrl as string);
      toast({
        title: "Success",
        description: "File uploaded successfully!",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Error uploading file",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const handleFile = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setProfileImageError(true);
      return;
    }

    setSelectedImage(file);
    const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));
    await uploadProfileImage(blob, file.name);
  };

  const onProfileFormAction = async (formData: FormData) => {
    try {
      const firstName = formData.get("firstName")?.toString() || "";
      const lastName = formData.get("lastName")?.toString() || "";
      const whatsappNumber = Number(formData.get("whatsappNumber")) || 0;
      const twitter = formData.get("twitter")?.toString() || "";
      const linkedin = formData.get("linkedin")?.toString() || "";

      await updateUser({
        userId: profile?._id as Id<"users">,
        firstName,
        lastName,
        whatsappNumber,
        imageUrl: profileFileUrl || profile?.imageUrl,
        imageStorageId: fileStorageId !== null ? fileStorageId : undefined,
        twitter,
        linkedin,
      });

      toast({
        title: "Success",
        description: "Profile update is successful!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to update profile.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: z.infer<typeof userSchema>) => {
    setLoading(true);
    let formData = new FormData(formRef.current!);

    try {
      await onProfileFormAction(formData);
    } catch (error: any) {
      setIssues([`Submission failed: ${error.message}`]);
    } finally {
      setLoading(false);
    }
  };

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
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              _profile
            </h2>
            <div className="hidden sm:flex items-center space-x-2">
              {form.watch("firstName") && form.watch("lastName") && (
                <StyledButton
                  disabled={loading || uploadingImage}
                  type="submit"
                  form="profileForm"
                >
                  {loading ? (
                    <Loader size={20} className="animate-spin ml-2" />
                  ) : (
                    "Save profile"
                  )}
                </StyledButton>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="grid gap-4 grid-cols-1">
                <div className="">
                  <form
                    id="profileForm"
                    ref={formRef}
                    className="space-y-8"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <GradientHeading size="xs">
                      Let's get to know you
                    </GradientHeading>
                    <FormField
                      control={form.control}
                      name="profileImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profile Image (optional)</FormLabel>
                          <FormControl>
                            <div>
                              <div
                                className="border-2 max-w-[100px] sm:max-w-[150px] border-dashed border-gray-200 dark:border-gray-800 rounded-lg p-4 flex justify-center items-center cursor-pointer"
                                onClick={() =>
                                  document
                                    .getElementById("file-upload")
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
                                    if (file.size > MAX_FILE_SIZE) {
                                      setProfileImageError(true);
                                      return;
                                    }
                                    handleFile(file);
                                  }
                                }}
                              >
                                {selectedImage ? (
                                  <Image
                                    src={URL.createObjectURL(selectedImage)}
                                    alt="Selected Image"
                                    width={150}
                                    height={150}
                                    className="rounded-lg object-cover"
                                  />
                                ) : (
                                  <span className="text-gray-500">
                                    Drag {`'n'`} drop or click to change
                                  </span>
                                )}
                              </div>
                              <Input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (file.size > MAX_FILE_SIZE) {
                                      setProfileImageError(true);
                                      return;
                                    }
                                    handleFile(file);
                                  }
                                }}
                              />
                              <div className="relative w-full mt-2">
                                {uploadingImage && (
                                  <>
                                    <p className="text-sm">
                                      Uploading image...
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
                          <FormMessage>
                            {profileImageError ? (
                                <span className="text-red-500 ml-1 text-xs">File size exceeds 2 MB. Please upload a smaller file.</span>
                              ) : null}
                          </FormMessage>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <span className="text-red-500">* </span>First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your first name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <span className="text-red-500">* </span>Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your last name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="whatsappNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your phone number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-cols-2 sm:flex-row gap-2">
                      <FormField
                        control={form.control}
                        name="twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Twitter/X Handle</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter username alone"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn Username</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter username alone"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex sm:hidden">
                      {form.watch("firstName") && form.watch("lastName") && (
                        <StyledButton
                          disabled={loading || uploadingImage}
                          type="submit"
                          form="profileForm"
                        >
                          {loading ? (
                            <Loader size={20} className="animate-spin ml-2" />
                          ) : (
                            "Save profile"
                          )}
                        </StyledButton>
                      )}
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

export default ProfileForm;