class MyEditor extends HTMLElement {
    constructor() {
      super();

      // Membuat elemen HTML yang akan ditampilkan di dalam tag "my-editor"
      const shadow = this.attachShadow({ mode: "open" });
      // Membuat elemen HTML untuk menu format teks
      const formatText = document.createElement("div");
      formatText.setAttribute("class", "formattext");
      formatText.innerHTML = `
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <link rel="stylesheet" href="styles.css">
      <button id="bold"><i class="fa-solid fa-bold"></i></button>
      <button id="underline"><b><u>U</u></b></button>
      <button id="italic"><b>I</b></button>
      <button id="ul"><i class="fas fa-bars"></i></button>
      <button id="ol"><i class="fas fa-link"></i></button>
      <div class="dropdown">
        <button id="dropdown-toggle" class="dropbtn"><i class="fas fa-heading"></i></button>
        <div id="dropdown-content" class="dropdown-content">
          <button id="h2">H1</button>
          <button id="h3">H2</button>
          <button id="p">P</button>
        </div>
      </div> 
      <button id="image"><i class="far fa-image"></i></button>
    `;

      // Menambahkan elemen menu format teks ke dalam tag "my-editor"
      shadow.appendChild(formatText);
      // Membuat elemen HTML untuk editor teks
      const editor = document.createElement("div");
      editor.setAttribute("contenteditable", "true");
      editor.setAttribute("id", "editor");

      // Menambahkan elemen editor teks ke dalam tag "my-editor"
      shadow.appendChild(editor);

      // Fungsi untuk memperbarui tampilan tombol format teks
      function updateFormatButtons() {
        const selection = window.getSelection();
        const formatButtons = [boldBtn, italicBtn, underlineBtn, linkBtn];

        // Loop melalui semua tombol format teks
        formatButtons.forEach((button) => {
          // Jika teks yang dipilih memiliki format yang sesuai dengan tombol, ubah warna latar belakang tombol menjadi biru
          if (document.queryCommandState(button.dataset.command)) {
            button.style.backgroundColor = "blue";
          } else {
            button.style.backgroundColor = "transparent";
          }

          // Jika teks yang dipilih adalah link, ubah ikon pada tombol link menjadi unlink
          if (
            selection.anchorNode.parentNode.tagName === "A" &&
            button === linkBtn
          ) {
            button.innerHTML = "<i class='fas fa-unlink'></i>";
          } else if (button === linkBtn) {
            button.innerHTML = "<i class='fas fa-link'></i>";
          }
        });
      }

      // Menambahkan event listener untuk setiap tombol pada menu format teks
      const boldBtn = shadow.getElementById("bold");
      const underlineBtn = shadow.getElementById("underline");
      const italicBtn = shadow.getElementById("italic");
      const listBtn = shadow.getElementById("ul");
      let listType = "ol";
      const link = shadow.getElementById("ol");
      let listType2 = "link";
      const h2Btn = shadow.getElementById("h2");
      const h3Btn = shadow.getElementById("h3");
      const pBtn = shadow.getElementById("p");
      const imgBtn = shadow.getElementById("image");
      boldBtn.addEventListener("click", () => {
        editor.focus();
        document.execCommand("bold", false, null);
      });
      underlineBtn.addEventListener("click", () => {
        editor.focus();
        document.execCommand("underline", false, null);
      });
      italicBtn.addEventListener("click", () => {
        editor.focus();
        document.execCommand("italic", false, null);
      });
      listBtn.addEventListener("click", () => {
        if (listType === "ol") {
          document.execCommand("insertOrderedList", false, null);
          listType = "ul";
          listBtn.innerHTML = "<i class='fas fa-list-ol'></i>";
        } else if (listType === "ul") {
          document.execCommand("insertUnorderedList", false, null);
          listType = "ol";
          listBtn.innerHTML = "<i class='fas fa-list-ul'></i>";
        }
        editor.focus();
      });
      link.addEventListener("click", () => {
        if (listType2 === "link") {
          document.execCommand("createLink", false, prompt("Masukkan URL:"));
          listType2 = "unlink";
          link.innerHTML = "<i class='fas fa-unlink'></i>";
        } else if (listType2 === "unlink") {
          document.execCommand("unlink", false, null);
          listType2 = "link";
          link.innerHTML = "<i class='fas fa-link'></i>";
        }
        editor.focus();
      });

      h2Btn.addEventListener("click", () => {
        editor.focus();
        document.execCommand("formatBlock", false, "<h2>");
      });
      h3Btn.addEventListener("click", () => {
        editor.focus();
        document.execCommand("formatBlock", false, "<h3>");
      });
      pBtn.addEventListener("click", () => {
        editor.focus();
        document.execCommand("formatBlock", false, "<p>");
      });
      imgBtn.addEventListener("click", () => {
        const url = prompt("Enter the URL of the image:");
        if (url) {
          if (url.includes("youtube.com") || url.includes("youtu.be")) {
            // Link video dari YouTube
            if (isYoutubeVideo(url)) {
              const youtubeId = getYoutubeId(url);
              const iframe = document.createElement("iframe");
              iframe.setAttribute(
                "src",
                `https://www.youtube.com/embed/${youtubeId}`
              );
              iframe.setAttribute("allowfullscreen", "");
              document.execCommand("insertHTML", false, iframe.outerHTML);
            } else {
              alert("Invalid YouTube URL!");
            }
          } else if (
            url.includes("pexels.com") ||
            url.includes("pixabay.com") ||
            url.includes("unsplash.com")
          ) {
            // Link gambar dari Pexels, Pixabay, atau Unsplash
            const img = document.createElement("img");
            img.setAttribute("src", url);
            document.execCommand("insertHTML", false, img.outerHTML);
          } else {
            alert("Invalid image URL!");
          }
        }
        editor.focus();
      });

      // Menambahkan event listener untuk text area agar menampilkan isi editor teks saat diubah
      editor.addEventListener("input", () => {
        textArea.value = editor.innerHTML;
        this.dispatchEvent(
          new CustomEvent("textChange", { detail: textArea.value })
        );
      });

      // Menambahkan event listener untuk text area agar mengubah isi editor teks saat diubah
      textArea.addEventListener("input", () => {
        editor.innerHTML = textArea.value;
        this.dispatchEvent(
          new CustomEvent("textChange", { detail: textArea.value })
        );
      });
    }
  }

  // Mendaftarkan tag "my-editor" pada DOM
  customElements.define("arma-text", MyEditor);
  function updateFormatButtons() {
    const selection = window.getSelection();
    const formatButtons = [boldBtn, italicBtn, underlineBtn, linkBtn];

    // Loop melalui semua tombol format teks
    formatButtons.forEach((button) => {
      // Jika teks yang dipilih memiliki format yang sesuai dengan tombol, ubah warna latar belakang tombol menjadi biru dan tambahkan kelas "active"
      if (document.queryCommandState(button.dataset.command)) {
        button.style.backgroundColor = "blue";
      } else {
        button.style.backgroundColor = "";
      }
    });
