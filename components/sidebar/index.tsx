"use client";

import * as React from "react";
import {
  Video,
  GalleryVerticalEnd,
  Send,
  PanelLeftIcon,
  Copy,
  CheckCheck,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Link from "next/link";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface SideBarDialogProps {
  startupId: Id<"startups">;
}

export default function SideBarDialogPage({ startupId }: SideBarDialogProps) {
  return (
    <div className="flex items-center justify-center">
      <SettingsDialog startupId={startupId} />
    </div>
  );
}

function SettingsDialog({ startupId }: SideBarDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [userIp, setUserIp] = React.useState("");

  const [emailAddress, setEmailAddress] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");

  const [password, setPassword] = React.useState("");
  const [isPasswordValid, setIsPasswordValid] = React.useState(false);

  const [demoPassword, setDemoPassword] = React.useState("");
  const [isDemoPasswordValid, setIsDemoPasswordValid] = React.useState(false);

  const [isCopied, setIsCopied] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [view, setView] = React.useState<"pitch" | "demo" | "contact">("demo");

  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

  const startup = useQuery(api.startups.getStartupById, {
    startupId,
  });

  const viewDeck = useMutation(api.startups.saveNewLead);

  const viewDemo = useMutation(api.startups.saveNewDemoLead);

  React.useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const ipAddress = await fetch("https://api.ipify.org").then((res) =>
          res.text()
        );
        setUserIp(ipAddress);
      } catch (error) {
        console.error("Error fetching IP:", error);
      }
    };

    if (!userIp) {
      fetchIpAddress();
    }
  }, [startup?._id, userIp]);

  // Pitch Deck
  const hasAccess = localStorage.getItem(
    `hasDeckAccess_${startup?._id}_${userIp}`
  );

  const hasPasswordAccess = localStorage.getItem(
    `hasDeckPasswordAccess_${startup?._id}_${userIp}`
  );

  const requiresPassword = startup?.lockDeck;

  // Demo
  const hasDemoAccess = localStorage.getItem(
    `hasDemoAccess_${startup?._id}_${userIp}`
  );

  const hasDemoPasswordAccess = localStorage.getItem(
    `hasDemoPasswordAccess_${startup?._id}_${userIp}`
  );

  const demoRequiresPassword = startup?.lockDemo;

  // Pitch Deck
  const handlePasswordSubmit = () => {
    if (password === startup?.deckPassword) {
      const accessPasswordKey = `hasDeckPasswordAccess_${startup?._id}_${userIp}`;
      const userAccess = localStorage.getItem(accessPasswordKey);
      const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

      if (
        !userAccess ||
        Date.now() - parseInt(userAccess, 10) > oneDayInMilliseconds
      ) {
        localStorage.setItem(accessPasswordKey, Date.now().toString());
      }
      setIsPasswordValid(true);
    } else {
      toast({
        title: "Error",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewDeck = async () => {
    if (!emailAddress) {
      toast({
        title: "Error",
        description:
          "You need to enter your email address to view this pitch deck",
      });
      return;
    }

    if (!title) {
      toast({
        title: "Error",
        description: "You need to select a title",
      });
      return;
    }

    try {
      const timestamp = new Date().toISOString();
      const accessKey = `hasDeckAccess_${startup?._id}_${userIp}`;
      const userAccess = localStorage.getItem(accessKey);
      const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

      if (
        !userAccess ||
        Date.now() - parseInt(userAccess, 10) > oneDayInMilliseconds
      ) {
        localStorage.setItem(accessKey, Date.now().toString());
      }

      await viewDeck({
        startupId: startup?._id as Id<"startups">,
        deckHistory: [
          {
            emailAddress: emailAddress,
            viewerTitle: title,
            ipAddress: userIp,
            timestamp,
          },
        ],
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Error viewing pitch deck",
      });
    }
  };

  // Demo
  const handleDemoPasswordSubmit = () => {
    if (demoPassword === startup?.demoPassword) {
      const accessPasswordKey = `hasDemoPasswordAccess_${startup?._id}_${userIp}`;
      const userAccess = localStorage.getItem(accessPasswordKey);
      const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

      if (
        !userAccess ||
        Date.now() - parseInt(userAccess, 10) > oneDayInMilliseconds
      ) {
        localStorage.setItem(accessPasswordKey, Date.now().toString());
      }
      setIsDemoPasswordValid(true);
    } else {
      toast({
        title: "Error",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewDemo = async () => {
    if (!emailAddress) {
      toast({
        title: "Error",
        description: "You need to enter your email address to view this demo",
      });
      return;
    }

    if (!title) {
      toast({
        title: "Error",
        description: "You need to select a title",
      });
      return;
    }

    try {
      const timestamp = new Date().toISOString();
      const accessKey = `hasDemoAccess_${startup?._id}_${userIp}`;
      const userAccess = localStorage.getItem(accessKey);
      const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

      if (
        !userAccess ||
        Date.now() - parseInt(userAccess, 10) > oneDayInMilliseconds
      ) {
        localStorage.setItem(accessKey, Date.now().toString());
      }

      await viewDemo({
        startupId: startup?._id as Id<"startups">,
        demoHistory: [
          {
            emailAddress: emailAddress,
            viewerTitle: title,
            ipAddress: userIp,
            timestamp,
          },
        ],
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Error viewing demo",
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="mr-auto">
            Discover {startup?.name as string}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm sm:max-w-2xl md:w-full rounded-xl overflow-hidden p-0 max-h-[500px] sm:max-h-[400px] md:max-h-[600px] md:max-w-[800px] lg:max-w-[1000px]">
          <DialogTitle className="sr-only">
            Discover {startup?.name as string}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Find our more information about {startup?.name as string}
          </DialogDescription>
          <SidebarProvider className="items-start">
            <Sidebar
              collapsible="none"
              className={`${mobileOpen ? "block w-50" : "hidden"} md:block`}
            >
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          className="text-gray-800 dark:text-gray-400"
                          onClick={() => {
                            setView("demo");
                            setMobileOpen(false);
                          }}
                        >
                          <Video />
                          Demo
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          className="text-gray-800 dark:text-gray-400"
                          onClick={() => {
                            setView("pitch");
                            setMobileOpen(false);
                          }}
                        >
                          <GalleryVerticalEnd />
                          Pitch deck
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          className="text-gray-800 dark:text-gray-400"
                          onClick={() => {
                            setView("contact");
                            setMobileOpen(false);
                          }}
                        >
                          <Send />
                          Reach out to founder(s)
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
            <main className="flex h-[800px] flex-1 flex-col overflow-hidden">
              <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <PanelLeftIcon
                  onClick={toggleMobileSidebar}
                  className="md:hidden ml-3 h-6 w-6"
                />
                <div className="flex items-center gap-2 px-4">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href={`/${startup?.routing_name}`}>
                          {startup?.name as string}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>
                          {view === "pitch"
                            ? "Pitch deck"
                            : view === "demo"
                            ? "Demo"
                            : "Contact"}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </header>
              <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
                {view === "pitch" ? (
                  <>
                    {startup?.showDeck && startup.pitchDeckUrl ? (
                      <>
                        <div className="hidden sm:flex">
                          {hasAccess ? (
                            hasPasswordAccess ? (
                              (() => {
                                const url: string = startup?.pitchDeckUrl;

                                const getEmbedUrl = (url: string) => {
                                  if (url.includes("convex.cloud")) {
                                    return url;
                                  }
                                  if (url.includes("drive.google.com")) {
                                    const fileId = url.match(/[-\w]{25,}/);
                                    return `https://drive.google.com/file/d/${fileId}/preview`;
                                  }
                                  if (url.includes("dropbox.com")) {
                                    return url.replace("?dl=0", "?raw=1");
                                  }
                                  if (url.includes("scribd.com")) {
                                    const docId = url.split("/document/")[1];
                                    return `https://www.scribd.com/embeds/${docId}/content?start_page=1&view_mode=scroll`;
                                  }
                                  if (url.includes("docsend.com")) {
                                    return `${url.replace("/view", "/embed")}`;
                                  }
                                  if (url.includes("issuu.com")) {
                                    return url.replace("/docs/", "/embed/");
                                  }
                                  if (url.includes("slideshare.net")) {
                                    const docId =
                                      url.split("slideshare.net/")[1];
                                    return `https://www.slideshare.net/slideshow/embed_code/${docId}`;
                                  }
                                  if (url.includes("box.com")) {
                                    const fileId = url.split("/s/")[1];
                                    return `https://app.box.com/embed/s/${fileId}`;
                                  }
                                  if (url.includes("calameo.com")) {
                                    const publicationId =
                                      url.split("/read/")[1];
                                    return `https://view.calameo.com/${publicationId}`;
                                  }
                                  if (url.includes("yumpu.com")) {
                                    const pubId = url.split("/document/")[1];
                                    return `https://www.yumpu.com/en/embed/view/${pubId}`;
                                  }
                                  if (url.includes("flipsnack.com")) {
                                    const pubId = url.split("/document/")[1];
                                    return `https://www.flipsnack.com/widget/v2/widget.html?hash=${pubId}`;
                                  }
                                  if (url.includes("papermark.io")) {
                                    const pubId = url.split("/d/")[1];
                                    return `https://papermark.io/view/${pubId}`;
                                  }
                                  if (url.includes("pitch.com")) {
                                    const pitchId = url.split("/p/")[1];
                                    return `https://pitch.com/embed/${pitchId}`;
                                  }
                                  if (url.includes("publitas.com")) {
                                    const publicationId =
                                      url.split("/view/")[1];
                                    return `https://view.publitas.com/${publicationId}`;
                                  }
                                  if (url.includes("flowpaper.com")) {
                                    return `https://flowpaper.com/viewer/?paper=${encodeURIComponent(
                                      url
                                    )}`;
                                  }

                                  return url;
                                };

                                const embedUrl = getEmbedUrl(url);

                                return (
                                  <iframe
                                    src={embedUrl}
                                    width="100%"
                                    height="500px"
                                    style={{ border: "none" }}
                                    className="rounded-xl hidden sm:block"
                                    allowFullScreen
                                  />
                                );
                              })()
                            ) : requiresPassword && !isPasswordValid ? (
                              <>
                                <div className="grid grid-cols-1 gap-4 w-full">
                                  <div>
                                    <Label>Password</Label>
                                    <Input
                                      id="password"
                                      type="text"
                                      value={password}
                                      onChange={(e) =>
                                        setPassword(e.target.value)
                                      }
                                      placeholder="Enter password to unlock"
                                      className="w-full"
                                    />
                                  </div>
                                  <Button
                                    className="ml-auto justify-center"
                                    onClick={handlePasswordSubmit}
                                  >
                                    Unlock
                                  </Button>
                                </div>
                              </>
                            ) : (
                              (() => {
                                const url: string = startup?.pitchDeckUrl;

                                const getEmbedUrl = (url: string) => {
                                  if (url.includes("convex.cloud")) {
                                    return url;
                                  }
                                  if (url.includes("drive.google.com")) {
                                    const fileId = url.match(/[-\w]{25,}/);
                                    return `https://drive.google.com/file/d/${fileId}/preview`;
                                  }
                                  if (url.includes("dropbox.com")) {
                                    return url.replace("?dl=0", "?raw=1");
                                  }
                                  if (url.includes("scribd.com")) {
                                    const docId = url.split("/document/")[1];
                                    return `https://www.scribd.com/embeds/${docId}/content?start_page=1&view_mode=scroll`;
                                  }
                                  if (url.includes("docsend.com")) {
                                    return `${url.replace("/view", "/embed")}`;
                                  }
                                  if (url.includes("issuu.com")) {
                                    return url.replace("/docs/", "/embed/");
                                  }
                                  if (url.includes("slideshare.net")) {
                                    const docId =
                                      url.split("slideshare.net/")[1];
                                    return `https://www.slideshare.net/slideshow/embed_code/${docId}`;
                                  }
                                  if (url.includes("box.com")) {
                                    const fileId = url.split("/s/")[1];
                                    return `https://app.box.com/embed/s/${fileId}`;
                                  }
                                  if (url.includes("calameo.com")) {
                                    const publicationId =
                                      url.split("/read/")[1];
                                    return `https://view.calameo.com/${publicationId}`;
                                  }
                                  if (url.includes("yumpu.com")) {
                                    const pubId = url.split("/document/")[1];
                                    return `https://www.yumpu.com/en/embed/view/${pubId}`;
                                  }
                                  if (url.includes("flipsnack.com")) {
                                    const pubId = url.split("/document/")[1];
                                    return `https://www.flipsnack.com/widget/v2/widget.html?hash=${pubId}`;
                                  }
                                  if (url.includes("papermark.io")) {
                                    const pubId = url.split("/d/")[1];
                                    return `https://papermark.io/view/${pubId}`;
                                  }
                                  if (url.includes("pitch.com")) {
                                    const pitchId = url.split("/p/")[1];
                                    return `https://pitch.com/embed/${pitchId}`;
                                  }
                                  if (url.includes("publitas.com")) {
                                    const publicationId =
                                      url.split("/view/")[1];
                                    return `https://view.publitas.com/${publicationId}`;
                                  }
                                  if (url.includes("flowpaper.com")) {
                                    return `https://flowpaper.com/viewer/?paper=${encodeURIComponent(
                                      url
                                    )}`;
                                  }

                                  return url;
                                };

                                const embedUrl = getEmbedUrl(url);

                                return (
                                  <iframe
                                    src={embedUrl}
                                    width="100%"
                                    height="500px"
                                    style={{ border: "none" }}
                                    className="rounded-xl hidden sm:block"
                                    allowFullScreen
                                  />
                                );
                              })()
                            )
                          ) : (
                            <>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                <div>
                                  <Label>Email address</Label>
                                  <Input
                                    id="emailAddress"
                                    value={emailAddress}
                                    onChange={(e) =>
                                      setEmailAddress(e.target.value)
                                    }
                                    placeholder="Enter your email address to view"
                                    className="w-full"
                                  />
                                </div>
                                <div>
                                  <Label>Occupation</Label>
                                  <Select
                                    onValueChange={(value) => setTitle(value)}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="What do you do?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectItem value="investor">
                                          Investor
                                        </SelectItem>
                                        <SelectItem value="advisor">
                                          Advisor
                                        </SelectItem>
                                        <SelectItem value="operator">
                                          Operator
                                        </SelectItem>
                                        <SelectItem value="founder">
                                          Founder
                                        </SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </div>
                                {/** 
                                  <div>
                                    <Label>Phone number (optional)</Label>
                                    <Input
                                      id="phoneNumber"
                                      value={phoneNumber}
                                      onChange={(e) => setPhoneNumber(e.target.value)}
                                      placeholder="Enter phone number"
                                    />
                                  </div>
                                */}
                                <div></div>
                                <Button
                                  className="ml-auto justify-center"
                                  onClick={handleViewDeck}
                                >
                                  View deck
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="sm:hidden">
                          You can only view pitch decks on desktop devices for
                          optimal presentation.
                        </div>
                      </>
                    ) : (
                      <p>{startup?.name} has no pitch deck listed.</p>
                    )}
                  </>
                ) : view === "demo" ? (
                  <>
                    {startup?.showDemo && startup.demoUrl ? (
                      <>
                        <div>
                          {hasDemoAccess ? (
                            hasDemoPasswordAccess ? (
                              (() => {
                                const url: string = startup?.demoUrl;

                                const getEmbedUrl = (url: string) => {
                                  if (url.includes("youtu.be")) {
                                    const videoId = url.split("youtu.be/")[1];
                                    return `https://www.youtube.com/embed/${videoId}`;
                                  }
                                  if (url.includes("youtube.com")) {
                                    const videoId = new URL(
                                      url
                                    ).searchParams.get("v");
                                    return `https://www.youtube.com/embed/${videoId}`;
                                  }
                                  if (url.includes("vimeo.com")) {
                                    const videoId = url.split("vimeo.com/")[1];
                                    return `https://player.vimeo.com/video/${videoId}`;
                                  }
                                  if (url.includes("loom.com")) {
                                    const videoId =
                                      url.split("loom.com/share/")[1];
                                    return `https://www.loom.com/embed/${videoId}`;
                                  }
                                  if (url.includes("dailymotion.com")) {
                                    const videoId = url.split("video/")[1];
                                    return `https://www.dailymotion.com/embed/video/${videoId}`;
                                  }
                                  if (url.includes("wistia.com")) {
                                    const videoId =
                                      url.split("wistia.com/medias/")[1];
                                    return `https://fast.wistia.com/embed/medias/${videoId}`;
                                  }
                                  if (url.includes("facebook.com")) {
                                    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
                                      url
                                    )}`;
                                  }
                                  if (url.includes("twitch.tv")) {
                                    const channelName =
                                      url.split("twitch.tv/")[1];
                                    return `https://player.twitch.tv/?channel=${channelName}&parent=example.com`;
                                  }
                                  if (url.includes("tiktok.com")) {
                                    return `https://www.tiktok.com/embed/${url
                                      .split("/")
                                      .pop()}`;
                                  }
                                  if (url.includes("instagram.com")) {
                                    return `${url}embed`;
                                  }
                                  if (url.includes("twitter.com")) {
                                    return `https://twitframe.com/show?url=${encodeURIComponent(
                                      url
                                    )}`;
                                  }

                                  if (url.includes("brightcove.com")) {
                                    return `${url}/embed`;
                                  }
                                  if (url.includes("jwplayer.com")) {
                                    const videoId = url.split("videos/")[1];
                                    return `https://cdn.jwplayer.com/players/${videoId}`;
                                  }
                                  return null;
                                };

                                const embedUrl = getEmbedUrl(url);

                                return embedUrl ? (
                                  <iframe
                                    width="100%"
                                    height="500px"
                                    className="rounded-xl"
                                    src={embedUrl}
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                ) : (
                                  <video
                                    controls
                                    width="100%"
                                    height="500px"
                                    className="rounded-xl"
                                    poster={startup?.displayImageUrl || "/placeholder.png"}
                                  >
                                    <source
                                      src={startup.demoUrl}
                                      type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                );
                              })()
                            ) : demoRequiresPassword && !isDemoPasswordValid ? (
                              <>
                                <div className="grid grid-cols-1 gap-4 w-full">
                                  <div>
                                    <Label>Password</Label>
                                    <Input
                                      id="password"
                                      type="text"
                                      value={demoPassword}
                                      onChange={(e) =>
                                        setDemoPassword(e.target.value)
                                      }
                                      placeholder="Enter password to unlock"
                                      className="w-full"
                                    />
                                  </div>
                                  <Button
                                    className="ml-auto justify-center"
                                    onClick={handleDemoPasswordSubmit}
                                  >
                                    Unlock
                                  </Button>
                                </div>
                              </>
                            ) : (
                              (() => {
                                const url: string = startup?.demoUrl;

                                const getEmbedUrl = (url: string) => {
                                  if (url.includes("youtu.be")) {
                                    const videoId = url.split("youtu.be/")[1];
                                    return `https://www.youtube.com/embed/${videoId}`;
                                  }
                                  if (url.includes("youtube.com")) {
                                    const videoId = new URL(
                                      url
                                    ).searchParams.get("v");
                                    return `https://www.youtube.com/embed/${videoId}`;
                                  }
                                  if (url.includes("vimeo.com")) {
                                    const videoId = url.split("vimeo.com/")[1];
                                    return `https://player.vimeo.com/video/${videoId}`;
                                  }
                                  if (url.includes("loom.com")) {
                                    const videoId =
                                      url.split("loom.com/share/")[1];
                                    return `https://www.loom.com/embed/${videoId}`;
                                  }
                                  if (url.includes("dailymotion.com")) {
                                    const videoId = url.split("video/")[1];
                                    return `https://www.dailymotion.com/embed/video/${videoId}`;
                                  }
                                  if (url.includes("wistia.com")) {
                                    const videoId =
                                      url.split("wistia.com/medias/")[1];
                                    return `https://fast.wistia.com/embed/medias/${videoId}`;
                                  }
                                  if (url.includes("facebook.com")) {
                                    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
                                      url
                                    )}`;
                                  }
                                  if (url.includes("twitch.tv")) {
                                    const channelName =
                                      url.split("twitch.tv/")[1];
                                    return `https://player.twitch.tv/?channel=${channelName}&parent=example.com`;
                                  }
                                  if (url.includes("tiktok.com")) {
                                    return `https://www.tiktok.com/embed/${url
                                      .split("/")
                                      .pop()}`;
                                  }
                                  if (url.includes("instagram.com")) {
                                    return `${url}embed`;
                                  }
                                  if (url.includes("twitter.com")) {
                                    return `https://twitframe.com/show?url=${encodeURIComponent(
                                      url
                                    )}`;
                                  }

                                  if (url.includes("brightcove.com")) {
                                    return `${url}/embed`;
                                  }
                                  if (url.includes("jwplayer.com")) {
                                    const videoId = url.split("videos/")[1];
                                    return `https://cdn.jwplayer.com/players/${videoId}`;
                                  }
                                  return null;
                                };

                                const embedUrl = getEmbedUrl(url);

                                return embedUrl ? (
                                  <iframe
                                    width="100%"
                                    height="500px"
                                    className="rounded-xl"
                                    src={embedUrl}
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                ) : (
                                  <video
                                    controls
                                    width="100%"
                                    height="500px"
                                    className="rounded-xl"
                                    poster={startup?.displayImageUrl}
                                  >
                                    <source
                                      src={startup.demoUrl}
                                      type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                );
                              })()
                            )
                          ) : (
                            <>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                <div>
                                  <Label>Email address</Label>
                                  <Input
                                    id="emailAddress"
                                    value={emailAddress}
                                    onChange={(e) =>
                                      setEmailAddress(e.target.value)
                                    }
                                    placeholder="Enter your email address to view"
                                    className="w-full"
                                  />
                                </div>
                                <div>
                                  <Label>Occupation</Label>
                                  <Select
                                    onValueChange={(value) => setTitle(value)}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="What do you do?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectItem value="investor">
                                          Investor
                                        </SelectItem>
                                        <SelectItem value="advisor">
                                          Advisor
                                        </SelectItem>
                                        <SelectItem value="operator">
                                          Operator
                                        </SelectItem>
                                        <SelectItem value="founder">
                                          Founder
                                        </SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </div>
                                {/** 
                                  <div>
                                    <Label>Phone number (optional)</Label>
                                    <Input
                                      id="phoneNumber"
                                      value={phoneNumber}
                                      onChange={(e) => setPhoneNumber(e.target.value)}
                                      placeholder="Enter phone number"
                                    />
                                  </div>
                                */}
                                <div></div>
                                <Button
                                  className="ml-auto justify-center"
                                  onClick={handleViewDemo}
                                >
                                  View demo
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    ) : (
                      <p>{startup?.name} has no demo listed.</p>
                    )}
                  </>
                ) : (
                  <div className="max-w-3xl">
                    <h2 className="text-xl font-semibold">
                      Contact the Founder(s)
                    </h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                      If you’re interested in learning more about{" "}
                      {startup?.name} or would like to reach out to the
                      founder(s), please contact:
                    </p>
                    <CopyToClipboard
                      text={startup?.contact_email as string}
                      onCopy={() => {
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 3000);
                      }}
                    >
                      <div className="mt-4 flex items-center cursor-pointer">
                        <span className="text-sm text-gray-800 dark:text-gray-400">
                          {startup?.contact_email}
                        </span>
                        {!isCopied ? (
                          <Copy className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 ml-2 inline-flex" />
                        ) : (
                          <span className="ml-2 text-blue-500 text-sm">
                            <CheckCheck className="h-4 w-4 inline-flex mr-1" />
                            Copied
                          </span>
                        )}
                      </div>
                    </CopyToClipboard>

                    <Link href={`mailto:${startup?.contact_email}`}>
                      <Button className="mt-4">Send an Email</Button>
                    </Link>
                  </div>
                )}
              </div>
            </main>
          </SidebarProvider>
        </DialogContent>
      </Dialog>
    </>
  );
};