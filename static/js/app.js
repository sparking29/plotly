function getPlot(id) {
    // pull data from the json file using D3
    d3.json("Data/samples.json").then((data)=> {
        console.log(data)
  
        var wfreq = data.metadata.map(d => d.wfreq)
        console.log(`Washing Freq: ${wfreq}`)
        
        // filter sample values
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        
        console.log(samples);
  
        // top 10
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
  
        // reverse top 10
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        
        var OTU_id = OTU_top.map(d => "OTU " + d)

        // label the top 10
        var labels = samples.otu_labels.slice(0, 10);
  
        // create trace variables
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'rgb(142,124,195)'},
            type:"bar",
            orientation: "h",
        };
  
        // create data variable
        var data = [trace];
  
        // create layout variable
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };
  
        // create the bar plot
        Plotly.newPlot("bar", data, layout);
      
        // bubble chart
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
  
        };
  
        var layout_b = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };
  
        var data1 = [trace1];
  
        Plotly.newPlot("bubble", data1, layout_b); 
  
        // gauge chart
  
        var data_g = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(wfreq),
          title: { text: `Weekly Washing Frequency ` },
          type: "indicator",
          
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9] },
                   steps: [
                    { range: [0, 2], color: "yellow" },
                    { range: [2, 4], color: "orange" },
                    { range: [4, 6], color: "red" },
                    { range: [6, 8], color: "lime" },
                    { range: [8, 9], color: "aqua" },
                  ]}
              
          }
        ];
        var layout_g = { 
            width: 700, 
            height: 600, 
            margin: { t: 20, b: 40, l:100, r:100 } 
          };
        Plotly.newPlot("gauge", data_g, layout_g);
      });
  }  


function getInfo(id) {
    //  get data again using D3
    d3.json("Data/samples.json").then((data)=> {
        
        // get the metadata info 
        var metadata = data.metadata;

        console.log(metadata)

        // filter meta data
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // select demographic panel using D3
        var demographicInfo = d3.select("#sample-metadata");
        
        // empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// create the change event
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

function init() {
    // select dropdown menu using D3
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("Data/samples.json").then((data)=> {
        console.log(data)

        // get the data in the dropdown
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // Display plots
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();