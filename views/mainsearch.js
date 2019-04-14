document.getElementById("searchsong").addEventListener("click", () => {
  const val = document.getElementById("arttitl").value;

  if (!val) {
    return;
  }

  document.location.href = "/searchsong?song=" + val;
});
