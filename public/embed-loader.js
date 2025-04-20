(function () {
  const scriptTag = document.currentScript;
  const containerName = scriptTag.dataset.container || "custom-container";
  const redirectUrl = scriptTag.dataset.redirectUrl || "/";
  const signInUrl = scriptTag.dataset.signInUrl || "https://i.delvglobal.co/sign-in";
  const script = document.createElement("script");
  const urlcdn = "https://i.delvglobal.co";
  script.type = "module";
  script.src = `${urlcdn}/dist/embed.js?v=${new Date().getTime()}`;
  script.onload = () => {
    if (window.EmbedForm) {
      window.EmbedForm(containerName, redirectUrl, signInUrl);
    }
  };
  document.body.appendChild(script);
})();
