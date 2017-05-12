function init()
{

    d3.select("#kmeans")
        .on("click", function(d,i) {
            d3.selectAll("svg").remove();
            plot_kmeans();
        })
    d3.select("#r_sp")
        .on("click", function(d,i) {
            d3.selectAll("svg").remove();
            plot_screenplot(0);
        })
    d3.select("#s_sp")
        .on("click", function(d,i) {
            d3.selectAll("svg").remove();
            plot_screenplot(1);
        })
    d3.select("#r_pca")
        .on("click", function(d,i) {
            d3.selectAll("svg").remove();
            plot_pca_loading(0);
        })
    d3.select("#s_pca")
        .on("click", function(d,i) {
            d3.selectAll("svg").remove();
            plot_pca_loading(1);
        })
    d3.select("#r_2pca")
        .on("click", function(d,i) {
            d3.selectAll("svg").remove();
            plot_2d_scatterplot(0,0);
        })
    d3.select("#s_2pca")
        .on("click", function(d,i) {
            d3.selectAll("svg").remove();
            plot_2d_scatterplot(1,0);
        })
    d3.select("#r_mds_e")
        .on("click", function(d,i) {
            d3.selectAll("svg").remove();
            plot_2d_scatterplot(0,1);
        })
    d3.select("#s_mds_e")
        .on("click", function(d,i) {
            d3.selectAll("svg").remove();
            plot_2d_scatterplot(1,1);
        })
    d3.select("#r_mds_c")
        .on("click", function(d,i) {
            d3.selectAll("svg").remove();
            plot_2d_scatterplot(0,2);
        })
    d3.select("#s_mds_c")
        .on("click", function(d,i) {
            d3.selectAll("svg").remove();
            plot_2d_scatterplot(1,2);
        })
    d3.select("#r_sm")
        .on("click", function(d,i) {
            d3.selectAll("svg").remove();
            plot_3d_scatterplot(0);
        })
    d3.select("#s_sm")
        .on("click", function(d,i) {
            d3.selectAll("svg").remove();
            plot_3d_scatterplot(1);
        })
}
