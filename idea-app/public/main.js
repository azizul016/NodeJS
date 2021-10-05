const categoryForm = document.querySelector("#categoryForm");
const categoryInput = document.querySelector("#category");
const categoryMsg = document.querySelector(".categoryMsg");
const allCategory = document.querySelector(".allCategory");

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
  allCategory.innerHTML = result.join("     ");
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

//add category event handler
categoryForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const categoryName = categoryInput?.value;
  const result = await addCategory({ category: categoryName });
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

//delete category add event listener;
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

//show all time category
//initial category loaded

async function showAllCategory() {
  const categoryResult = await getCategories();
  if (categoryResult?.success) {
    showCategory(categoryResult.categories);
  }
}
showAllCategory();
