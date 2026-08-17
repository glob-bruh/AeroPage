
// --- BANNER CODE ---

async function getDocument(url) {
    const response = await fetch(url);
    return await response.text();
}

function getRandomInt(max) {
    // Do not async this function.
    return Math.floor(Math.random() * max);
}

async function bannerLoader(gifID) {
    var x = await getDocument("gif-list.txt");
    x = x.split("\n");
    if (gifID === undefined) {
        image2use = x[getRandomInt(x.length)];
    } else {
        if (gifID > x.length - 1 || gifID < 0) {
            return "fail";
        } else {
            image2use = x[gifID];
        }
    }
    var banner = document.getElementById("bannerImg");
    banner.style.backgroundImage = "url('" + image2use + "')";
    return image2use;
}

// --- TERMINAL CODE ---

async function printTxt(text, newline) {
    if (newline === undefined) {
        commandText.value = commandText.value + "\n" + text;
    } else {
        commandText.value = commandText.value + text;
    }
}

async function scrollToBottom() {
    commandText.scrollTop = commandText.scrollHeight;
}

async function openInNewTab(url) {
    window.open(url);
    printTxt("A new tab to " + url + " has been opened.");
}

// --- MARQUEE CODE ---

async function setMarquee() {
    x = await getDocument("motd.txt");
    x = x.replaceAll("\n", " ***** ");
    document.getElementById("marqueeText").innerText = ">>> " + x + " <<<";
    printTxt("MOTD loaded.");
}

// ---------------------------------------------------------------------------------------------
// --- AppView LOGIC ---

async function appview_LOADAPPHTML(appName) {
    x = document.getElementById("appviewViewport");
    x.replaceChildren();
    c = await getDocument(location.origin + "/appviewApps/" + appName + "/content.html");
    x.innerHTML = c;
    sT = x.querySelectorAll("script");
    if (sT.length > 0) {
        for (let i = 0; i < sT.length; i++) {
            sT[i].remove();
            sTe = document.createElement("script");
            sTe.src = sT[i].src;
            document.getElementById("appviewViewport").append(sTe);
        }
    }
    appViewClicked();
}

// ---------------------------------------------------------------------------------------------
// --- COMMAND LOGIC ---

async function cmd_EXPORT(cmd) {
    printTxt("Initiate export of text in terminal.");
    console.log(commandText.value);
}

async function cmd_HELP(cmd) {
    printTxt("===== Help Menu: =====");
    printTxt("Usage: help [page#]");
    printTxt("-----")
    switch (cmd[1]) {
        default:
        case "1":
            printTxt("* cls:          clears terminal screen.                                    ");
            printTxt("* discord:      i do have a discord.                                       ");
            printTxt("* email:        shoot me an email.                                         ");
            printTxt("* export:       export and download all text on terminal.                  ");
            printTxt("* github:       i do have a github.                                        ");
            printTxt("* help:         shows this menu.                                           ");
            printTxt("* indieweb:     run indieweb app.                                          ");
            printTxt("* intro:        read my intro.                                             ");
            printTxt("* man:          redirect to blog page.                                     ");
            printTxt("* projects:     list of my projects.                                       ");
            x = 1 ; break;
        case "2":
            printTxt("* reloadbanner:    grabs a new banner gif (in case the current one bores you).");
            printTxt("* reloadwallpaper: grabs a new wallpaper (in case the current one bores you). ");
            x = 2 ; break;
    }
    printTxt("-----");
    printTxt("Help page " + x);
    printTxt("======================");
}

async function cmd_INTRO(cmd) {
    printTxt("••••• gl0bSECURE •••••");
    printTxt("       (aka g0)       ");
    printTxt("programming | cybersecurity | networking");
    printTxt("I make ■ pegs fit in ● holes.");
}

async function cmd_MAN(cmd) {
    x = await getDocument(location.origin + "/blog/content.md");
    x = x.split("\n")
    let y = [];
    for (let i = 0; i < x.length; i++) {
        if (x[i].includes("* [")) {
            var blogName = x[i].split("[")[1].split("]")[0];
            var blogFile = x[i].split("(")[1].split(")")[0].split("=")[1];
            y.push([blogName, blogFile]);
        }
    }
    printTxt("MAN - Manuals? Or blog pages...")
    printTxt("Usage: man [blogcode]");
    if (cmd[1] !== undefined) {
        for (let i = 0; i < y.length; i++) {
            if (y[i][1] === cmd[1]) {
                window.open(location.origin + "/blog?doc=" + cmd[1] + "&theme=os");
                printTxt("A new tab for the blog page " + cmd[1] + " has been opened.");
                scrollToBottom();
                return;
            }
        }
    }
    printTxt ("Blogs in database:")
    for (let i = 0; i < y.length; i++) {
        printTxt("* " + y[i][0] + " (blogcode: " + y[i][1] + ").");
    }
    scrollToBottom();
}

async function cmd_PROJECTS(cmd) {
    x = JSON.parse(await getDocument(location.origin + "/projectList.json"));
    console.log(x);
    printTxt("------------");
    printTxt("| Projects |");
    printTxt("------------");
    for (let i = 0; i < Object.keys(x).length; i++) {
        keyName = Object.keys(x)[i];
        description = x[keyName]["desc"].replaceAll("\n", "");
        printTxt(i + ") " + keyName + ": " + description);
    }
    printTxt("------------");
    scrollToBottom();
}

async function cmd_RELOADBANNER(cmd) {
    printTxt("Usage: reloadbanner [ID]")
    if (cmd[1] === undefined) {
        x = await bannerLoader();
        printTxt("New banner loaded!");
        printTxt("Gif URL: " + x);
    } else {
        id = Number(cmd[1]);
        if (Number.isNaN(id)) {
            printTxt("Invalid ID")
        } else {
            x = await bannerLoader(id);
            if (x === "fail") {
                printTxt("Invalid ID")
            } else {
                printTxt("Banner ID " + id + " loaded!");
                printTxt("Gif URL: " + x);
            }
        }
    }
    scrollToBottom();
}

async function cmd_RELOADWALLPAPER(cmd) {
    newImgUrl = "https://minimalistic-wallpaper.demolab.com/?random&t=" + new Date().getTime();
    bodyTag.style.backgroundImage = "url('" + newImgUrl + "')";
    printTxt("New wallpaper loaded!");
    scrollToBottom();
}

// ---------------------------------------------------------------------------------------------

async function cmdSent() {
    cmd = commandBox.value;
    cmdSplit = commandBox.value.split(" ");
    printTxt("[" + Date.now() + "] > " + cmd);
    commandBox.value = "";
    previousCmd = cmd;
    switch (cmdSplit[0]) {
        case "cls": commandText.value = ""; printTxt("Terminal cleared."); break;
        case "color": cmd_COLOR(cmdSplit); break;
        case "discord": printTxt("ADD ME ON DISCORD: gl0bSECURE"); break;
        case "email": openInNewTab("mailto:globbruh@proton.me"); break;
        case "export": cmd_EXPORT(cmdSplit); break;
        case "github": openInNewTab("https://github.com/glob-bruh"); break;
        case "help": cmd_HELP(cmdSplit); break;
        case "indieweb": appview_LOADAPPHTML("indieweb"); break;
        case "intro": cmd_INTRO(cmdSplit); break;
        case "man": cmd_MAN(cmdSplit); break;
        case "projects": cmd_PROJECTS(cmdSplit); break;
        case "reloadbanner": cmd_RELOADBANNER(cmdSplit); break;
        case "reloadwallpaper": cmd_RELOADWALLPAPER(cmdSplit); break;
        case "": break;
        default: printTxt("Command not found."); break;
    }
    scrollToBottom();
}

async function searchKey() {
    if (event.key === "Enter") {
        cmdSent();
    }
    if (event.key === "ArrowUp") {
        commandBox.value = previousCmd;
    }
}

async function appViewClicked() {
    const element = document.getElementById("siderButtonR");
    if (element) {
        document.getElementById("contentWrap").style.gridTemplateColumns = "0% 5% 95%";
        document.getElementById("terminal").style.visibility = "hidden";
        document.getElementById("AppView").style.height = "525px";
        document.getElementById("AppView").style.visibility = "visible";
        document.getElementById("siderButtonR").setAttribute("id", "siderButtonL");
        printTxt("AppView has been opened.");
    } else {
        document.getElementById("contentWrap").style.gridTemplateColumns = "95% 5% 0%";
        document.getElementById("terminal").style.visibility = "visible";
        document.getElementById("AppView").style.height = "0px"; // If AppView is not set to 0px, then it will compress all elements on top of each other when closed, and its height becomes massive.
        document.getElementById("AppView").style.visibility = "hidden";
        document.getElementById("siderButtonL").setAttribute("id", "siderButtonR");
        printTxt("AppView has been closed.");
    }
    scrollToBottom();
}

async function loadIn() {
    commandText.value = "";
    printTxt("**************************");
    printTxt("gl0bSECUREOS Terminal v1.0");
    printTxt("**************************");
    await setMarquee();
    printTxt("Enter 'help' for help menu.\n");
}

var previousCmd = "";
var bodyTag = document.getElementsByTagName("body")[0];
var commandBox = document.getElementsByTagName("input")[0];
var commandText = document.getElementsByTagName("textarea")[0];
bannerLoader();
loadIn();