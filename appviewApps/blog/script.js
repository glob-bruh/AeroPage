
async function markdownInitiatorMODIFIED(p) {
    const ufContent = p.split("\n");
    globalThis.chapterElem = tocGenerator(ufContent)
    x = markdownExtensions(ufContent);
    x = markdown(x);
    var mdElem = document.querySelector("#MARKDOWN-CONTENT-HERE");
    mdElem.innerHTML = x;
    await collapseParser(); // THIS CONVERTS THE DROPDOWN TAGS TO ACTUAL DROPDOWNS
    return;
}

async function main() {
    document.getElementById("MARKDOWN-CONTENT-HERE").replaceChildren();
    page = sessionStorage.getItem("blog2load");
    sessionStorage.removeItem("blog2load");
    blogTxt = await getDocument("https://tech.beyondgone.xyz/blog/" + page + "/content.md");
    markdownInitiatorMODIFIED(blogTxt);
    x = document.querySelector('a[href="/blog/"]');
    if (x) {
        x.remove();
    }
}

main();