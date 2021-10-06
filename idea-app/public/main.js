const categoryForm = document.querySelector("#categoryForm");
const categoryInput = document.querySelector("#category");
const categoryMsg = document.querySelector(".categoryMsg");
const allCategory = document.querySelector(".allCategory");
const likeBtn = document.querySelector(".like-btn");
const likeCount = document.querySelector(".like-count");
const commentCount = document.querySelector(".comment-count");
const userId = document.querySelector(".user-id");

//common show message;
const showMessage = (info) => {
  if (info.success) {
    categoryMsg.innerHTML = `
  <div class="alert alert-success">
    ${info.message}
  </div>
  `;
  } else {
    categoryMsg.innerHTML = `
  <div class="alert alert-danger">
    ${info.message}
  </div>
  `;
  }
};

//add category
const addCategory = async (data) => {
  try {
    const response = await fetch("/categories", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    return await response.json();
  } catch (error) {
    console.log(error?.message);
  }
};

//get all categories
const getCategories = async () => {
  try {
    const category = await fetch("/categories");
    return await category.json();
  } catch (error) {
    console.log(error?.message);
  }
};

//show category
const showCategory = (categories) => {
  const result = categories?.map(
    ({ category }) =>
      ` <span class="badge bg-primary" data-name="${category}">${category}  <i class="fa fa-trash mx-2" style="cursor: pointer"></i>  </span> `
  );
  // console.log(result, "result");
  if (allCategory) {
    allCategory.innerHTML = result.join("     ");
  }
};

//delete category;
const deleteCategory = async ({ categoryName }) => {
  try {
    const response = await fetch(`/categories/${categoryName}`, {
      method: "DELETE",
    });
    return await response.json();
  } catch (error) {
    console.log(error?.message);
  }
};

//like added
const addLike = async (id, userId) => {
  try {
    const response = await fetch(`/ideas/${id}/likes`, {
      method: "POST",
      body: JSON.stringify({ userId }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    return await response.json();
  } catch (error) {
    console.log(error?.message);
  }
};

//get like count;
const getLikeCount = async (id) => {
  try {
    const response = await fetch(`/ideas/${id}/likes`);
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

//get comment count
const getCommentCount = async (id) => {
  try {
    const response = await fetch(`/ideas/${id}/comments`);
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

//show like comment;
const showLikeCount = (data) => {
  likeCount.innerHTML = data;
};

//show comment comment;
const showCommnetCount = (data) => {
  commentCount.innerHTML = data;
};

//add category event handler
if (categoryForm) {
  categoryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const categoryName = categoryInput?.value;
    const result = await addCategory({ category: categoryName });
    categoryInput.value = "";
    if (result?.success) {
      categoryMsg.innerHTML = `
      <div class="alert alert-success text-capitalize" role="alert">
          ${result?.message}
      </div>
    `;
      const categoryResult = await getCategories();

      //show category function
      if (categoryResult?.success) {
        showCategory(categoryResult.categories);
      }
    } else {
      categoryMsg.innerHTML = `
      <div class="alert alert-danger text-capitalize" role="alert">
          ${result?.message}
      </div>
    `;
      const categoryResult = await getCategories();
      //show category function
      if (categoryResult?.success) {
        showCategory(categoryResult.categories);
      }
    }
  });
}

//delete category add event listener;
if (allCategory) {
  allCategory.addEventListener("click", async (e) => {
    try {
      // console.log(e?.target?.classList.contains("fa"), "event");
      if (e?.target?.classList.contains("fa")) {
        const categoryName = e?.target?.parentElement?.dataset?.name;
        const result = await deleteCategory({ categoryName });
        if (result?.success) {
          categoryMsg.innerHTML = `
          <div class="alert alert-success text-capitalize" role="alert">
              ${result?.message}
          </div>
        `;
          const categoryResult = await getCategories();

          //show category function
          if (categoryResult?.success) {
            showCategory(categoryResult.categories);
          }
        } else {
          categoryMsg.innerHTML = `
          <div class="alert alert-danger text-capitalize" role="alert">
              ${result?.message}
          </div>
        `;
          const categoryResult = await getCategories();
          //show category function
          if (categoryResult?.success) {
            showCategory(categoryResult.categories);
          }
        }
      }
    } catch (e) {
      console.log(e?.message);
    }
  });
}

//like event handlers;
if (likeBtn) {
  likeBtn.addEventListener("click", async (e) => {
    const ideaId = e.target.dataset.id;
    // console.log(e?.target?.dataset.id, "event");
    const user = userId.dataset.id;
    if (!user) {
      showMessage({
        success: false,
        message: `Please <a href="/auth/login">login</a> to like the idea`,
      });
      return;
    }

    try {
      const result = await addLike(ideaId, user);

      //showing message;
      showMessage(result);
      const countResult = await getLikeCount(ideaId);

      // console.log(countResult, "countResult");

      if (countResult.success) {
        showLikeCount(countResult.data);
      } else {
        //showing message;
        showMessage(countResult);
      }
    } catch (error) {
      console.log(error);
    }
  });
}

//show all time category
//initial category loaded

async function showAllCategory() {
  const categoryResult = await getCategories();
  if (categoryResult?.success) {
    showCategory(categoryResult.categories);
  }
}

async function showAllLikes() {
  let ideaId;
  try {
    if (likeBtn) {
      ideaId = likeBtn.dataset.id;

      //get all like count;
      const likesResult = await getLikeCount(ideaId);
      // console.log(likesResult, "likesResult");
      if (likesResult) {
        //showing like Count;
        return showLikeCount(likesResult?.data);
      } else {
        //showing like Count;
        return showMessage(likesResult);
      }

      //for category;
    }
  } catch (error) {}
}

async function showAllComment() {
  let ideaId;
  try {
    ideaId = likeBtn.dataset.id;
    const commentResult = await getCommentCount(ideaId);
    if (commentResult.success) {
      return showCommnetCount(commentResult.data);
    } else {
      return showMessage(commentResult);
    }
  } catch (error) {
    console.log(error);
  }
}

showAllCategory();
showAllLikes();
showAllComment();
