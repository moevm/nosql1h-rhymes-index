document.getElementById("searchsong").addEventListener("click", () => {
  const val1 = document.getElementById("arttitl").value;
  const val2 = document.getElementById("titl").value;
  const val = val1 + "|" + val2;
  if (!val) {
    return;
  }

  document.location.href = "/searchsong?song=" + val;
});
