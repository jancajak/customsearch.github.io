(function() {
  var DOMstrings = {
    subButton: 'sub_button',
    search: 'search',
    searchClass: '.search',
    clearClass: '.clear',
    nextLink: 'link-next',
    prevLink: 'link-prev',
    show: '.show'
  }

  //Setup event listener to search button
  document.getElementById(DOMstrings.subButton).addEventListener('click', function() {

    if (false) {
      document.getElementById(DOMstrings.search).required = true;
    } else {
      var query;
      query = document.getElementById(DOMstrings.search).value;

      // Function to display elements to which results will come
      function show() {
        var show;
         show = document.querySelectorAll(DOMstrings.show);
         for (var i = 0; i < show.length; i++) {
           show[i].style.display = 'block';
         }
      };

      function clear()  {
        var list;
        list = document.querySelectorAll(DOMstrings.clearClass);
        for (var i = 0; i < list.length; i++) {
          list[i].remove();
        }
      };

      function web(page) {
        var snd, url;
        
        // Prepare a request to google server for website results
        snd = new XMLHttpRequest;
        url = 'https://www.googleapis.com/customsearch/v1?q=' + query + '&cx=017332051821951173556%3Azy_vj321j6i&key=AIzaSyBiU_b9B-OiVvGgTpNlYwGBuVPTMkWYMbQ&start=' + page;
        snd.onreadystatechange = function show() {
          var myJson, next, nextNumber, moveLink, sum, actual, actualStart, actualCount, newActualLink;
          if (this.readyState === 4 && this.status === 200) {
            // Get JSON search data
            myJson = JSON.parse(this.response);
            hndlrWeb(myJson);

            //Create link function
            var create = function(type, number, ID, place) {
              var newNumber = '<%button% class="move_links clear" id=link-%count% href=#>%number%</%button%>';
              newNumber = newNumber.replace('%button%', type)
              newNumber = newNumber.replace('%number%', number);
              newNumber = newNumber.replace('%count%', ID);
              document.getElementById('links').insertAdjacentHTML(place, newNumber);
            };

            // Get number of the  page
            var getNumber = function (number) {
              var sum;
              number = number.toString().split('');
                if (number.length < 2) {
                  sum = number[0];
                }else {
                  sum = parseInt(number[0]) + parseInt(number[1]);
                }
              return sum;
            }

            // Actual page link
            actual = myJson.queries.request[0].startIndex;
            actual = getNumber(actual);
            create('a',actual, actual, 'beforeend');

            // Next page link
            if (myJson.queries.nextPage) {
              // Create a link to next page
              create('button','Next', 'next', 'beforeend');

              //Setup event listener for next link
              document.getElementById(DOMstrings.nextLink).addEventListener('click', function() {
                clear();
                web(myJson.queries.nextPage[0].startIndex.toString());
                image(myJson.queries.nextPage[0].startIndex.toString());
              });
            }

            // Prev page link
            if (myJson.queries.previousPage) {
              //Create a link to prev page
              create('button','Prev', 'prev', 'afterbegin')

              //Setup event listener for  prev link
              document.getElementById(DOMstrings.prevLink).addEventListener('click', function() {
                clear();
                web(myJson.queries.previousPage[0].startIndex.toString());
                image(myJson.queries.previousPage[0].startIndex.toString());
              })
            }
          }
        }
        // Send a request to google
        snd.open('GET', url, true);
        snd.send();

        // Function to display results
        function hndlrWeb(response) {
          var item, html, newHtml;
              // Loop over results
              for (var i = 0; i < response.items.length; i++) {

                item = response.items[i];

                //Create new Html items
                html = '<div class="title clear"><a href=%link%>%item.htmlTitle%</a></div><div class="description clear">%item.snippet%</div><a href="%item.link%" class="link clear">%item.link%</a>';
                newHtml = html.replace('%item.htmlTitle%', item.title);
                newHtml = newHtml.replace('%item.snippet%', item.snippet);
                newHtml = newHtml.replace('%item.link%', item.link);
                newHtml = newHtml.replace('%item.link%', item.link);
                newHtml = newHtml.replace('%link%', item.link)

                // Display newHtml in the page
                document.getElementById("items_web").insertAdjacentHTML('beforeend', newHtml);
              };
        };
      };

      function image(page) {
        var snd, url, query;
        // Prepare a request to google server
        snd = new XMLHttpRequest;
        query = document.getElementById('search').value;
        url = 'https://www.googleapis.com/customsearch/v1?q=' + query + '&cx=017332051821951173556%3Azy_vj321j6i&key=AIzaSyBiU_b9B-OiVvGgTpNlYwGBuVPTMkWYMbQ&searchType=image&start=' + page;
        snd.onreadystatechange = function() {
          if (this.readyState === 4 && this.status === 200) {
            var myJson = JSON.parse(this.response);   //2. Store JSON to variable
            hndlrImages(myJson);
          }
        };

        // Send a request to a google
        snd.open('GET', url, true);
        snd.send();

        // Function to display results
        function hndlrImages(response) {

              // Loop over results
              for (var i = 0; i < response.items.length; i++) {
                var item, html, newHtml;
                item = response.items[i];

                //Create new Html items
                html = '<img src=%link% class="images clear" alt=%title%>';
                newHtml = html.replace('%link%', item.link);
                newHtml = newHtml.replace('%title%', item.title);

                // Display newHtml in the page
                document.getElementById("items_images").insertAdjacentHTML('beforeend', newHtml);
              };
        }
      };

      //Run the website
      clear();
      show();
      web('1');
      image('1');
    }

  });
})();
