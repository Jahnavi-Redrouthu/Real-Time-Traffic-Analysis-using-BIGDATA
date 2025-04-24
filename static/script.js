let chartInstances = {};  // To hold Chart.js instances

document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.getElementById('columnSelect');
    dropdown.addEventListener('change', () => {
        fetchAndDrawCharts(dropdown.value);
    });
    fetchAndDrawCharts("all");  // Load all initially
});

async function fetchAndDrawCharts(filterColumn) {
    const response = await fetch("https://data.cityofnewyork.us/resource/i4gi-tjb9.json");
    const data = await response.json();

    // Destroy existing charts
    for (let key in chartInstances) {
        chartInstances[key].destroy();
    }

    // Hide all charts initially
    document.getElementById("timelineBox").style.display = 'none';
    document.getElementById("topSourceBox").style.display = 'none';

    if (filterColumn === "all") {
        drawDistributionChart(data);
        drawTimelineChart(data);
        drawTopSourceChart(data);
    } else {
        drawSingleColumnChart(data, filterColumn);
    }
}

function drawSingleColumnChart(data, column) {
    const ctx = document.getElementById('distributionChart').getContext('2d');
    const map = {};

    data.forEach(item => {
        const key = item[column] || "Unknown";
        map[key] = (map[key] || 0) + 1;
    });

    chartInstances['distribution'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(map),
            datasets: [{
                label: `Distribution by ${column}`,
                data: Object.values(map),
                backgroundColor: 'rgba(153, 102, 255, 0.6)'
            }]
        },
        options: {
            responsive: true
        }
    });
}

function drawDistributionChart(data) {
    const ctx = document.getElementById('distributionChart').getContext('2d');
    const congestionLevels = {};

    data.forEach(item => {
        const level = item.congestion_level || "Unknown";
        congestionLevels[level] = (congestionLevels[level] || 0) + 1;
    });

    chartInstances['distribution'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(congestionLevels),
            datasets: [{
                label: 'Count by Congestion Level',
                data: Object.values(congestionLevels),
                backgroundColor: 'rgba(255, 99, 132, 0.6)'
            }]
        },
        options: {
            responsive: true
        }
    });
}

function drawTimelineChart(data) {
    document.getElementById("timelineBox").style.display = 'block';
    const ctx = document.getElementById('timelineChart').getContext('2d');
    const timeMap = {};

    data.forEach(item => {
        const time = new Date(item.timestamp || item.created_date).toLocaleString();
        timeMap[time] = (timeMap[time] || 0) + 1;
    });

    const sortedTimes = Object.keys(timeMap).sort();

    chartInstances['timeline'] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedTimes,
            datasets: [{
                label: 'Traffic Reports Over Time',
                data: sortedTimes.map(time => timeMap[time]),
                borderColor: 'rgba(54, 162, 235, 0.8)',
                fill: false
            }]
        },
        options: {
            responsive: true
        }
    });
}

function drawTopSourceChart(data) {
    document.getElementById("topSourceBox").style.display = 'block';
    const ctx = document.getElementById('topSourceChart').getContext('2d');
    const sourceIPs = {};

    data.forEach(item => {
        const ip = item.source_ip || "Unknown";
        sourceIPs[ip] = (sourceIPs[ip] || 0) + 1;
    });

    const sorted = Object.entries(sourceIPs).sort((a, b) => b[1] - a[1]).slice(0, 10);

    chartInstances['topSource'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sorted.map(entry => entry[0]),
            datasets: [{
                label: 'Top Source IPs',
                data: sorted.map(entry => entry[1]),
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true
        }
    });
}