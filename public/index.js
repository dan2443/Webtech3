var createBtn = document.getElementById("createBtn");
var deleteList = document.querySelectorAll("#delete_list");

const init = () => {
  //set action for form
}; //delete html files, create from db html files

deleteList.forEach((list) =>
  list.addEventListener("click", (e) => {
    let siteId = list.getAttribute("data-id");
    deleteSite(siteId);
    location.reload();
  })
);

createBtn.addEventListener("click", (event) => {
  const formData = new FormData();
  let title = document.getElementById("site.title").value;
  formData.append("title", title);
  let content = document.getElementById("site.content").value;
  formData.append("content", content);
  let images = document.getElementById("site.images").files;
  if (images.length != 0) {
    for (let img of images) {
      formData.append("uploadedImages", img);
    }
  }

  createSite(formData);
  location.reload();
});

function createSite(formData) {
  const createMethod = {
    method: "POST",
    body: formData,
  };

  fetch("./sites", createMethod)
    .then((response) => response.json())
    .then((data) => console.log(data)) // Manipulate the data retrieved back, if we want to do something with it
    .catch((err) => console.log(err)); // Do something with the error
}

function deleteSite(siteId) {
  const deleteMethod = {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  };

  fetch("./sites/" + siteId, deleteMethod)
    .then((response) => response.json())
    .then((data) => console.log(data)) // Manipulate the data retrieved back, if we want to do something with it
    .catch((err) => console.log(err)); // Do something with the error
}
