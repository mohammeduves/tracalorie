//Storage Controller

//Item Controller
const ItemCtrl = (function() {
  //Item Controller
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  //Data Structure/ State
  const data = {
    items: [
      //   { id: 0, name: "Steak Dinner", calories: 1200 },
      //   { id: 1, name: "Cookies", calories: 400 },
      //   { id: 2, name: "Eggs", calories: 300 }
    ],
    currentItem: null,
    totalCalories: 0
  };
  //Public methods
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      //Create ID
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      //Calories to Number
      calories = parseInt(calories);
      //Create new Item
      newItem = new Item(ID, name, calories);
      //Add to items array
      data.items.push(newItem);
      return newItem;
    },
    updateItem: function(name, calories) {
      //calories to  number
      calories = parseInt(calories);

      let found = null;
      data.items.forEach(function(item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    getItemById: function(id) {
      let found = null;
      //Loop Through Items
      data.items.forEach(function(item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    getTotalCalories: function() {
      let total = 0;

      //Loop through items and all calories
      data.items.forEach(function(item) {
        total += item.calories;
      });
      //Set total calories in the data structure
      data.totalCalories = total;
      return data.totalCalories;
    },
    logData: function() {
      return data;
    }
  };
})();

/*-----------------------------------------------------*/

//UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    listItems: "#item-list li",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories"
  };
  //Public Methods
  return {
    populateItemList: function(items) {
      let html = "";

      items.forEach(function(item) {
        html += `
        <li class="collection-item" id="item-${item.id}">
        <strong>${item.name} : </strong><em>${
          item.calories
        } Calories:&nbsp; </em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>
        `;
      });
      //Insert List items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      };
    },
    addListItem: function(item) {
      //Show the list
      document.querySelector(UISelectors.itemList).style.display = "block";
      //Create li element
      const li = document.createElement("li");
      //Add class
      li.className = "collection-item";
      //Add ID
      li.id = `item-${item.id}`;

      //Add HTML
      li.innerHTML = `<strong>${item.name} : </strong><em>${
        item.calories
      } Calories:&nbsp; </em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;
      //Insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute("id");

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
          <strong>${item.name} : </strong><em>${
            item.calories
          } Calories:&nbsp; </em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
          `;
        }
      });
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    addItemToForm: function() {
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelectors.itemCaloriesInput
      ).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },
    clearEditState: function() {
      UICtrl.clearInput();

      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },

    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    getSelectors: function() {
      return UISelectors;
    }
  };
})();

/*-----------------------------------------------------*/

//App Controller
const App = (function(ItemCtrl, UICtrl) {
  //Load Event Listeners
  const loadEventListeners = function() {
    //Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    //Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    //Disable Submit on enter
    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    //Edit Icon Click Event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    //Update item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    //Back Button event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);
  };

  //Add Item submit
  const itemAddSubmit = function(e) {
    //Get form input from UI Controller
    const input = UICtrl.getItemInput();

    //Check for name and calorie input
    if (input.name !== "" && input.calories !== "") {
      //Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      //Add Item to UI List
      UICtrl.addListItem(newItem);

      //Get Total Calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);

      //Clear Fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  //Click edit item
  const itemEditClick = function(e) {
    if (e.target.classList.contains("edit-item")) {
      // Get list item id(item-0,item-1)
      const listId = e.target.parentNode.parentNode.id;
      //Break into an array
      const listIdArr = listId.split("-");
      //Get the actual ID
      const id = parseInt(listIdArr[1]);

      //Get Item
      const itemToEdit = ItemCtrl.getItemById(id);
      console.log(itemToEdit);
      //Set Current Item
      ItemCtrl.setCurrentItem(itemToEdit);
    }

    //Add item to form
    UICtrl.addItemToForm();
    e.preventDefault();
  };

  //Update item submit
  const itemUpdateSubmit = function(e) {
    //Get item input
    const input = UICtrl.getItemInput();

    //Update Item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    //Update UI
    UICtrl.updateListItem(updatedItem);

    //Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //Add total calories to the UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();
    e.preventDefault();
  };
  //Public methods
  return {
    init: function() {
      //Clear Edit State / set intital state
      UICtrl.clearEditState();

      //Fetch items from datastructure
      const items = ItemCtrl.getItems();

      //Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        //Populate List with Items
        UICtrl.populateItemList(items);
      }

      //Get Total Calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);

      //Load Event Listeners
      loadEventListeners();
    }
  };
})(ItemCtrl, UICtrl);

/*-----------------------------------------------------*/

//Initializing App
App.init();
