document.addEventListener('DOMContentLoaded', function() {
  const imageId = 14 //Enter your assigned imageId here
  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`
  const likeURL = `https://randopic.herokuapp.com/likes/`
  const commentsURL = `https://randopic.herokuapp.com/comments/`

  $.get(imageURL, function(data){
    $("#image").attr("src",data.url)
    $("#name").text(data.name)
    $("#likes").text(data.like_count)
    let className = "delete_button"
    data.comments.forEach(comment => {
      $("#comments").append(`<li id=${comment.id}>${comment.content}</li><button class=${className} data-id=${comment.id}>Delete</button>`)
      addButtonListener()
    })
  })

  $("#like_button").on('click', function() {
    //increase like number in DOM
    let increaseLike = parseInt($("#likes").text()) + 1
    $("#likes").text(increaseLike)

    //persist to database
    $.ajax({
      url: 'https://randopic.herokuapp.com/likes',
      type: 'POST',
      data: JSON.stringify({image_id: 14}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      success: function(data) {console.log(data)}
    })
  })


  $("#comment_form").on('submit', function(e) {
    e.preventDefault()
    //add comment to DOM
    let comment = $("#comment_input").val()
    $("#comment_input").val('')
    // $("#comments").append(`<li>${comment}</li>`)

    //persist to database
    $.ajax({
      url: 'https://randopic.herokuapp.com/comments',
      type: 'POST',
      data: JSON.stringify({image_id: 14, content: comment}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      success: function(data) {
        console.log(data)
        let className = "delete_button"
        $("#comments").append(`<li id=${data.id}>${data.content}</li><button class=${className} data-id=${data.id}>Delete</button>`)
        addButtonListener()
      }
    })
  })

  //delete a comment
addButtonListener = () => {
  $(".delete_button").click(function() {
    let commentId = this.dataset.id
    let comment = $(`#${commentId}`).text()
    $(`#${commentId}`).remove()
    this.remove()
    let url = `https://randopic.herokuapp.com/comments/${commentId}`
    $.ajax({
      url: url,
      type: 'DELETE'
    })

  })
}



})
