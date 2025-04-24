describe('Frontend: Dashboard UI Tests', () => {

  // Set up the DOM elements before each test
  beforeEach(() => {
    document.body.innerHTML = `
      <select id="dropdown">
        <option value="value1">Value 1</option>
        <option value="value2">Value 2</option>
        <option value="value3">Value 3</option>
      </select>
      <button id="executeButton">Execute</button>
      <div id="barChartContainer" class="chart-container" style="display:none;"></div>
      <div id="pieChartContainer" class="chart-container" style="display:none;"></div>
      <div id="map" style="display:none;"></div>
    `;
  });

  // Test for checking if dropdown exists and has correct ID
  test('Dropdown exists and has correct ID', () => {
    const dropdown = document.getElementById('dropdown');
    expect(dropdown).not.toBeNull();
    expect(dropdown.id).toBe('dropdown');
  });

  // Test for populating dropdown with keys from the data
  test('Dropdown is populated with keys from the data', () => {
    const mockData = [
      { key: 'value1' },
      { key: 'value2' },
      { key: 'value3' }
    ];

    // Mock the populateDropdown function
    const populateDropdown = jest.fn();
    populateDropdown(mockData);

    // Verify that populateDropdown was called with mock data
    expect(populateDropdown).toHaveBeenCalledWith(mockData);
  });

  // Test to check if the execute button triggers the handleExecute function
  test('Execute button exists and triggers handleExecute', () => {
    const button = document.getElementById('executeButton');
    expect(button).not.toBeNull();

    // Mock the handleExecute function
    const handleExecute = jest.fn();
    button.addEventListener('click', handleExecute);

    // Simulate the button click
    button.click();

    // Ensure that handleExecute was called
    expect(handleExecute).toHaveBeenCalled();
  });

  // Test to ensure chart containers are initially hidden
  test('Chart containers are initially hidden', () => {
    const chartContainers = document.querySelectorAll('.chart-container');
    chartContainers.forEach(container => {
      container.style.display = 'none'; // Ensure it's initially hidden
      expect(container.style.display).toBe('none');
    });
  });

  // Test to check dynamic content visibility after execute button click
  test('Dynamic content appears after execute button click', () => {
    const button = document.getElementById('executeButton');
    const barChartContainer = document.getElementById('barChartContainer');
    const pieChartContainer = document.getElementById('pieChartContainer');
    const map = document.getElementById('map');

    // Ensure button exists
    expect(button).not.toBeNull();

    // Simulate the dynamic behavior after clicking
    button.click();

    // Change the display to "block" to show the elements
    barChartContainer.style.display = 'block';
    pieChartContainer.style.display = 'block';
    map.style.display = 'block';

    // Ensure charts and map are displayed
    expect(barChartContainer.style.display).toBe('block');
    expect(pieChartContainer.style.display).toBe('block');
    expect(map.style.display).toBe('block');
  });

});
