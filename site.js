function unhideArticleOnScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  // need some scroll to react
  if (scrollTop < 200) return; 
  
  const footerHeight = 60;
  // factor between 0 and 1 to indicate how much of the article must be on screen before we unhide it
  const articleVisibility = 0.55; 
  const viewportBottom = scrollTop + (window.innerHeight - footerHeight) * articleVisibility;

  const articles = document.querySelectorAll("article:nth-child(n+2)");
  for (let i = 0; i < articles.length; i++) {
    const articleTop = articles[i].getBoundingClientRect().top + scrollTop;
    if (articles[i].className != "visible" && articleTop < viewportBottom) {
      articles[i].className = "visible";
    }
  }
}

function placeScrollIndicator() {
  const articles = document.querySelectorAll("article");

  const lastVisibleArticleIdx = Object.values(articles)
    .map((article, idx) => ({ article: article, idx: idx }))
    .filter(({ article, _ }) => article.className == "visible")
    .map(({ _, idx }) => idx)
    .reduce((a, b) => Math.max(a, b), 0);

  const currScrollIndicator = document.getElementById("scroll-indicator");

  const allArticlesVisible = lastVisibleArticleIdx == articles.length - 1;
  if (!allArticlesVisible) {
    const currScrollIndicatorAIdx = currScrollIndicator ? 
      currScrollIndicator.getAttribute("data-article-idx") : undefined;

    if (currScrollIndicatorAIdx != lastVisibleArticleIdx) {
      // move scroll indicator to bottom of last visible article
      if (currScrollIndicator) currScrollIndicator.remove();
      let scrollIndicator = document.createElement("div");
      scrollIndicator.id = "scroll-indicator";
      scrollIndicator.setAttribute("data-article-idx", lastVisibleArticleIdx);
      scrollIndicator.onclick = onScrollIndicatorClick;
      articles[lastVisibleArticleIdx].appendChild(scrollIndicator);
    }
  } else {
      // all articles visible, no scroll indicator needed anymore
      if (currScrollIndicator) currScrollIndicator.remove();
  }
}

function handleScroll() {
  unhideArticleOnScroll();
  placeScrollIndicator();
}

function onScrollIndicatorClick() {
  console.log("scroll indicator click");
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  window.scrollTo({
    top: scrollTop + 400,
    left: 0,
    behavior: "smooth",
  });
}

window.addEventListener('scroll', handleScroll);