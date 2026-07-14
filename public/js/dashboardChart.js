const canvas = document.getElementById("portfolioChart");

if (canvas) {

    new Chart(canvas, {

        const chartInfo = window.portfolioChartData;

        new Chart(canvas, {
            type: "bar",
            data: {
                labels: chartInfo.labels,
                datasets: [{
                    label: "Current Value",
                    data: chartInfo.data,
                    borderColor: "#6366F1",
                    backgroundColor: "rgba(99,102,241,0.35)",
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    display:false

                }

            },

            scales:{

                y:{

                    grid:{

                        color:"rgba(255,255,255,.05)"

                    },

                    ticks:{

                        color:"#94A3B8"

                    }

                },

                x:{

                    grid:{

                        display:false

                    },

                    ticks:{

                        color:"#94A3B8"

                    }

                }

            }

        }

    });

}