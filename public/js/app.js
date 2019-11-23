$(document).ready(() => {
  
    $("#scraper-btn").on("click", () => {
      $.ajax({
        method: "GET",
        url: "/scrape"
      }).then(response => {
        console.log("Scraping complete.");
        console.log(response)
        location.reload();
      });
    });
  
    $(".comments").on("click",(event)=>{
      event.preventDefault()
      
      $("#postComments").empty();
      
      console.log("Comments requested.")
      articleId = event.currentTarget.dataset.id
      console.log(articleId)
  
      $.ajax({
        method: "GET",
        url: `/comments/${articleId}`
      }).then(response => {
        console.log("Comments delivered.")
        console.log(response)
  
        response.map(comment => {
          let html = `
          <div class="comment-card">
            <h4 class="card-title">${comment.name}</h4>
            <p>${comment.comment}</p>
          </div>
          `
          $("#postComments").append(html);
        })
  
  
        
      });
    })
  
    $("#submit").on("click", (event)=> {
      event.preventDefault()
  
      console.log(event)
      let name = $("#commenterName").val();
      let comment = $("#commenterComment").val();
  
      console.log(articleId)
  
      $.ajax({
        method: "POST",
        url: `/comments/${articleId}`,
        data:{
          name: name,
          comment: comment
        } 
      }).then(response => {
        console.log(response)
  
        $("#commenterName").val("")
        $("#commenterComment").val("")
  
      });
  
    });
  
  
  });