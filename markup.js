var input1 = `* item1
* item2
= head
* item3
((https://google.com)) text  text.
* item4
* item5`;

const formatter = (input) => {
  const htmlElementsArray = [];

  var lines = input.split("\n");

  // loops through each line and checks whether they are started with * = (()) if so we will append htmlElementsArray by each element
  lines.forEach((line, index) => {
    if (line.startsWith("=")) {
      const head = line.slice(1);
      htmlElementsArray.push(`<h1>${head}</h1>`);
    } else if (line.startsWith("*")) {
      const item = line.slice(1);
      htmlElementsArray.push(`<li>${item}</li>`);
    } else {
      // Here we are checking if (( and )) exist. If not the index will return -1; We also make sure that (( is before ))
      if (
        line.indexOf("((") !== -1 &&
        line.indexOf("))") !== -1 &&
        !(line.indexOf("((") > line.indexOf("))"))
      ) {
        const link = line.slice(line.indexOf("((") + 2, line.indexOf("))"));
        const e =
          "<p>" +
          line.substring(0, line.indexOf("((")) +
          `<a href="${link}">link</a>` +
          line.substring(line.indexOf("))") + 2, line.length) +
          "</p>";
        htmlElementsArray.push(e);
      } else {
        htmlElementsArray.push(`<p>${line}</p>`);
      }
    }
  });

  const nestedElementsArray = [];
  let lists = [];

  /* loop through each element and search for nested loops, if the next element starts with a <li> tag and the next element is within bounds we will append a list of li. So if we have 1 li, we append just '<li></li>', if we have 2 consecutive li we append ['li','li']. This way we are able to connect li later on using array.join and we wrap it with <ul></ul> tag. if the condition is not met we simply push the element and reset the list.
   */
  htmlElementsArray.forEach((element, index) => {
    if (element.startsWith("<li")) {
      if (
        index + 1 < htmlElementsArray.length &&
        htmlElementsArray[index + 1].startsWith("<li>")
      ) {
        lists.push(element);
      } else {
        lists.push(element);
        nestedElementsArray.push(lists);

        lists = [];
      }
    } else {
      nestedElementsArray.push(element);
    }
  });

  const parsedHtml = [];

  /* Here we will check each element. If it is an array means it contains an <li></li> element. If it is an array > 1 means we have nested li. Then we can join the array and wrap it in </ul>. */
  nestedElementsArray.forEach((element) => {
    if (Array.isArray(element)) {
      if (element.length > 1) {
        parsedHtml.push(`<ul>${element.join("")}</ul>`);
      } else {
        parsedHtml.push(`<ul>${element[0]}</ul>`);
      }
    } else {
      parsedHtml.push(element);
    }
  });
  console.log(parsedHtml.join(""));
};

formatter(input1);

/*
  Input:

    * item1
    * item2
    = head
    * item3
    ((https://google.com)) text  text.
    * item4
    * item5`
  
  
  Output:

  <ul><li> item1</li><li> item2</li></ul><h1> head</h1><ul><li> item3</li></ul><p>text <a href="https://ya.ru link">link</a> text.</p><ul><li> item4</li><li> item5</li></ul> 
  
  */
