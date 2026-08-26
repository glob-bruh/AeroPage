
function APPVIEW_main() {
    document.getElementById("MARKDOWN-CONTENT-HERE").replaceChildren();
    page = sessionStorage.getItem("blog2load");
    sessionStorage.removeItem("blog2load");
    blogTxt = DL_getDocumentNonAsync("https://tech.beyondgone.xyz/blog/" + page + "/content.md")[1];
    MARKDOWN_markdownInitiator(blogTxt);
    x = document.querySelector('a[href="/blog/"]');
    if (x) { x.remove(); }
    x = document.getElementsByTagName("img");
    for (let i = 0; i < x.length; i++) {
        if (x[i].closest("div").id == "MARKDOWN-CONTENT-HERE") {
            imageFilename = x[i].src.split("/").at(-1);
            x[i].src = "https://tech.beyondgone.xyz/blog/" + page + "/" + imageFilename;
        }
    }
}