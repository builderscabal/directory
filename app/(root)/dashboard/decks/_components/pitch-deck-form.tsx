"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, X } from "lucide-react";
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
import { pitchDeckSchema } from "@/constants/schema";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "convex/react";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Progress } from "@/components/ui/progress";
import { UploadIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FileExtension = "pdf";

interface UserProps {
  userId: string;
}

export const StartupPitchDeck = ({ userId }: UserProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [selectedDeck, setSelectedDeck] = useState<File | null>(null);
  const [uploadingDeck, setUploadingDeck] = useState(false);
  const [deckId, setDeckId] = useState<Id<"_storage"> | null>(null);
  const [deckFileUrl, setDeckFileUrl] = useState("");

  const [issues, setIssues] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  const [sizeError, setSizeError] = useState<boolean>(false);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl, {
    onUploadProgress: (progress: any) => setUploadProgress(progress),
  });

  const getFileUrl = useMutation(api.startups.getUrl);

  const profile = useQuery(api.users.getUserByClerkId, {
    clerkId: userId,
  });

  const startups = useQuery(api.startups.getStartupsByUserId, {
    userId: profile?._id as Id<"users">,
  });

  const deckUpload = useMutation(api.startups.uploadStartupDeck);

  const form = useForm<z.output<typeof pitchDeckSchema>>({
    resolver: zodResolver(pitchDeckSchema),
    mode: "onChange",
    defaultValues: {
      startupId: "",
      pitchDeckUrl: "",
      showDeck: false,
    },
  });

  const { handleSubmit, watch } = form;
  const selectedStartupId = watch("startupId");

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
      pdf: "application/pdf",
    };

    return mimeTypes[extension as FileExtension] || "application/octet-stream";
  };

  const uploadPitchDeck = async (blob: Blob, fileName: string) => {
    setUploadingDeck(true);
    setUploadProgress(0);
    try {
      const mimeType = getMimeType(fileName);
      const file = new File([blob], fileName, { type: mimeType });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setDeckId(storageId);

      const fileUrl = await getFileUrl({ storageId });
      setDeckFileUrl(fileUrl as string);
      form.setValue("pitchDeckUrl", fileUrl as string, {
        shouldValidate: true,
      });
      toast({
        title: "Success",
        description: "Pitch deck uploaded successfully!",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Error uploading pitch deck",
        variant: "destructive",
      });
    } finally {
      setUploadingDeck(false);
    }
  };

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const handleDeckFile = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setSizeError(true);
      return;
    }

    setSelectedDeck(file);
    const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));
    await uploadPitchDeck(blob, file.name);
  };

  const onSubmitDeckAction = async (data: z.infer<typeof pitchDeckSchema>) => {
    try {
      const startupId = data.startupId;

      await deckUpload({
        startupId: startupId as Id<"startups">,
        pitchDeckUrl: deckFileUrl || "",
        pitchDeckStorageId: deckId !== null ? deckId : undefined,
        showDeck: false,
      });

      toast({
        title: "Success",
        description: "Pitch deck has been uploaded!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to upload pitch deck.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: z.infer<typeof pitchDeckSchema>) => {
    setLoading(true);
    try {
      await onSubmitDeckAction(data);
      window.location.reload();
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
              _upload
            </h2>
            <div className="hidden sm:flex items-center space-x-2">
              <StyledButton
                disabled={loading || uploadingDeck}
                type="submit"
                form="startupForm"
              >
                {loading ? (
                  <Loader size={20} className="animate-spin ml-2" />
                ) : (
                  "Upload pitch deck"
                )}
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
                      Select a startup to upload a new pitch deck
                    </GradientHeading>

                    <FormField
                      control={form.control}
                      name="startupId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Startups</FormLabel>
                          <Select
                            onValueChange={(value: any) => {
                              form.setValue("startupId", value);
                              setSizeError(false);
                            }}
                            defaultValue={form.getValues("startupId")}
                          >
                            <FormControl>
                              <SelectTrigger>
                                {form.watch("startupId") ? (
                                  <SelectValue>
                                    <span className="capitalize">
                                      {startups?.find(
                                        (startup) =>
                                          startup._id ===
                                          form.watch("startupId")
                                      )?.name || "Select a startup"}
                                    </span>
                                  </SelectValue>
                                ) : (
                                  <span className="placeholder">
                                    Select a startup
                                  </span>
                                )}
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {startups?.map((startup) => (
                                <SelectItem
                                  key={startup._id}
                                  value={startup._id}
                                >
                                  {startup.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            ".pdf" is the recommended format
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedStartupId && (
                      <FormField
                        control={form.control}
                        name="pitchDeckUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Upload Pitch Deck
                            </FormLabel>
                            <FormControl>
                              <div>
                                <div
                                  className="group relative grid h-[400px] w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25"
                                  onClick={() =>
                                    document
                                      .getElementById("file-upload")
                                      ?.click()
                                  }
                                  onDragOver={(e) => {
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
                                        setSizeError(true);
                                        return;
                                      }
                                      handleDeckFile(file);
                                    }
                                  }}
                                >
                                  {selectedDeck ? (
                                    <iframe
                                      src={URL.createObjectURL(selectedDeck)}
                                      width="100%"
                                      height="360"
                                      className="rounded-lg"
                                      title="PDF Preview"
                                    ></iframe>
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
                                          You can upload a PDF with a max size
                                          of 2 MB
                                        </p>
                                        {sizeError ? (
                                          <span className="text-red-500 text-xs">File size exceeds 2 MB. Please upload a smaller file.</span>
                                        ) : null}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <Input
                                  id="file-upload"
                                  type="file"
                                  accept="application/pdf"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      if (file.size > MAX_FILE_SIZE) {
                                        setSizeError(true);
                                        return;
                                      }
                                      handleDeckFile(file);
                                    }
                                  }}
                                />
                                <div className="relative w-full mt-2">
                                  {uploadingDeck && (
                                    <>
                                      <p className="text-sm">
                                        Uploading Pitch Deck...
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
                    )}

                    <div className="flex sm:hidden">
                      <StyledButton
                        disabled={loading || uploadingDeck}
                        type="submit"
                        form="startupForm"
                      >
                        {loading ? (
                          <Loader size={20} className="animate-spin ml-2" />
                        ) : (
                          "Upload pitch deck"
                        )}
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

export default StartupPitchDeck;