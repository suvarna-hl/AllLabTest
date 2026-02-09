function loadCityData() {
  const cityData = {};
  const cityContainers = document.querySelectorAll('.city-data');
  
  cityContainers.forEach(cityDiv => {
    const cityName = cityDiv.getAttribute('data-city');
    const tests = [];
    
    const testItems = cityDiv.querySelectorAll('.test-item');
    testItems.forEach(item => {
      tests.push({
        title: item.getAttribute('data-title'),
        description: item.getAttribute('data-description'),
        tests: item.getAttribute('data-tests'),
        price: item.getAttribute('data-price'),
        parameters: item.getAttribute('data-parameters').split(',')
      });
    });
    
    cityData[cityName] = tests;
  });
  
  return cityData;
}

let cityData;
let labTests;
let activeFilter = "PROFILE";
let itemsToShow = 10;
const itemsPerLoad = 10;

document.addEventListener("DOMContentLoaded", () => {
  // Load city data after DOM is ready
  cityData = loadCityData();
  labTests = cityData["Gurgaon"];
  const buttons = document.querySelectorAll(".filter-btn");
  const container = document.getElementById("rowsContainer");
  const template = document.getElementById("rowTemplate");
  const lapview = document.getElementById("lapview");
  const loadMoreBtn = document.getElementById("loadbtn");
  const citySelect = document.getElementById("citySelect");

  const profileHeader = document.getElementById("profileHeader");
  const parameterHeader = document.getElementById("parameterHeader");

  // City selection handler
  citySelect.addEventListener("change", (e) => {
    const selectedCity = e.target.value;
    labTests = cityData[selectedCity];
    itemsToShow = 10;
    renderRows();
  });

  function updateHeaders() {
    if (activeFilter === "PARAMETER") {
      profileHeader.style.display = "none";
      testsHeader.style.display = "none";
      parameterHeader.style.display = "grid";
      lapview.classList.add("parameter-mode");
      params.textContent = "Parameters";
    }
    else if (activeFilter === "PACKAGES") {
      profileHeader.style.display = "grid";
      parameterHeader.style.display = "none";
      testsHeader.style.display = "grid";
      lapview.classList.remove("parameter-mode");
      testsHeader.textContent = "Total Tests";
      priceHeader.textContent = "Price in Gurgaon";
    }
    else {
      profileHeader.style.display = "grid";
      parameterHeader.style.display = "none";
      testsHeader.style.display = "grid";
      lapview.classList.remove("parameter-mode");
      testsHeader.textContent = "Total Tests";
      priceHeader.textContent = "Price in Gurgaon";
    }
  }

  function renderRows() {
    container.innerHTML = "";

    const testsToRender = labTests.slice(0, itemsToShow);

    testsToRender.forEach((test,index) => {
      const clone = template.content.cloneNode(true);

      clone.querySelector("h3").textContent = test.title;
      
      const descriptionElement = clone.querySelector(".description");
      if (activeFilter === "PACKAGES") {
        descriptionElement.style.display = "none";
      } else {
        descriptionElement.style.display = "";
        descriptionElement.textContent = test.description;
      }

      const testCount = clone.querySelector(".test-count");
      const rightCell = clone.querySelector(".right-cell");

      testCount.style.display = "";
      rightCell.innerHTML = "";
      rightCell.textContent = "";

      if (activeFilter === "PARAMETER") {
        testCount.style.display = "none";

        const paramWrap = document.createElement("div");
        paramWrap.className = "parameter-wrapper";

        test.parameters.forEach(p => {
          const chip = document.createElement("span");
          chip.className = "parameter-chip";
          chip.textContent = p;
          paramWrap.appendChild(chip);
        });

        rightCell.appendChild(paramWrap);
      } 
      else {
        testCount.textContent = test.tests;
        rightCell.textContent = test.price;
      }
  const rowDivider = clone.querySelector(".row-divider");
      if (index === 0) {
        rowDivider.style.display = "none";
      }

      container.appendChild(clone);
    });

    updateLoadMoreButton();
  }

  function updateLoadMoreButton() {
    const loadMoreContainer = document.querySelector(".loadbt");
    if (itemsToShow >= labTests.length) {
      loadMoreContainer.style.display = "none";
    } else {
      loadMoreContainer.style.display = "flex";
    }
  }

  function updateButtons() {
    buttons.forEach(btn => {
      const active = btn.textContent.trim() === activeFilter;
      btn.style.background = active ? "#00A0A8" : "#EBEBEB";
      btn.style.color = active ? "#fff" : "#5A5E65";
    });
  }

  loadMoreBtn.addEventListener("click", () => {
    itemsToShow += itemsPerLoad;
    renderRows();
  });

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      activeFilter = btn.textContent.trim();
      itemsToShow = 10;
      updateHeaders();
      renderRows();
      updateButtons();
    });
  });

  updateHeaders();
  renderRows();
  updateButtons();
});

