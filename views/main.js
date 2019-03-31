window.onload = function() {
const FindSongButton = document.getElementById("FindSong");
FindSongButton.addEventListener("click", myfunc);
};

 function myfunc(){
     var myword = document.getElementById("myword").value;
     alert(myword);
 }


document.getElementById('search').addEventListener('click', () => {
    const val = document.getElementById('myword').value;

    if (!val) { return; }

    // var str = val;
    // alert(str.substring(2));

    document.location.href = ("/search?word=" + val);
});