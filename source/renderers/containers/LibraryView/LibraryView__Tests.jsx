import React from "react";
import { shallow } from "enzyme";
import LibraryView from "./LibraryView";

describe("Containers", function() {
  describe("LibraryView", function() {
    beforeEach(function() {
      this.searchFilterText = "whoopdeedoo";
      this.library = {
        lastUpdated: 12345,
        books: {
          "flappy-monkey": {
            id: "flappy-monkey",
            title: "Flappy Monkey Banana Attack"
          },
          "flappy-monkey-2": {
            id: "flappy-monkey-2",
            title: "Return of the Flappy Monkey"
          }
        }
      };

      this.component = shallow(<LibraryView library={this.library} />);
      this.component.setState({ searchFilter:  this.searchFilterText });
    });

    it("Should render a `div` with a class of `library-view`", function() {
      expect(this.component.type()).to.equal("div");
      expect(this.component.hasClass("library-view")).to.be.true;
    });

    it("Should render a BookList component, and pass it our books and filter state", function() {
      const bookList = this.component.find("BookList");
      expect(bookList.prop("books")).to.equal(this.library.books);
      expect(bookList.prop("searchFilter")).to.equal(this.searchFilterText);
    });

    it("Should render a Loading component if no library is passed in as a prop", function() {
      this.component = shallow(<LibraryView />);
      expect(this.component.text()).to.equal("loading...");
    });

    it("Should render a searchBar with the correct props", function() {
      const input = this.component.find(".library-view__search");
      expect(input.is("SearchBar")).to.be.true;
    });

    it("Should change the `searchFilter` state on input", function(done) {
      expect(this.component.state().searchFilter).to.equal(this.searchFilterText);

      // Simulate keyboard input into our <input />
      this.component.find("SearchBar").simulate("change", { target: { value: "weewoo" } });

      setTimeout(() => {
        expect(this.component.state().searchFilter).to.equal("weewoo");
        done();
      }, 1000);
    });
  });
});
