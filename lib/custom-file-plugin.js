'use strict';

// TODO: There has to be a cleaner way to do this???
// eslint-disable-next-line no-undef
module.exports = function (fileName, contents) {
  return {
    apply: (compiler) => {
      compiler.hooks.emit.tapAsync('VersionFilePlugin', (compilation, callback) => {
        compilation.assets[fileName] = {
          source: function () {
            return contents;
          },
          size: function () {
            return contents.length;
          },
        };
        callback();
      });
    },
  };
};


import logging

def prevent_light_mode_flash(current_page, target_page):
    """
    Prevents light mode flash when switching between pages.

    Args:
        current_page (str): The current page the user is on.
        target_page (str): The page the user is switching to.

    Returns:
        bool: True if the switch is successful, False otherwise.
    """
    if not isinstance(current_page, str) or not isinstance(target_page, str):
        raise TypeError("Both current_page and target_page must be strings")

    # Define the pages that are known to cause issues
    problematic_pages = ["leaderboard"]

    # Check if the target page is one of the problematic pages
    if target_page in problematic_pages:
        # If the current page is not the catalog, we need to take extra precautions
        if current_page != "catalog":
            # Add a temporary CSS class to prevent the light mode flash
            # This assumes that the CSS class 'prevent-light-mode-flash' is defined
            # and will prevent the light mode flash
            add_temporary_css_class("prevent-light-mode-flash")

    # Perform the page switch
    try:
        # This assumes that the page switch is handled by a function called 'switch_page'
        switch_page(target_page)
        return True
    except Exception as e:
        logging.error(f"Failed to switch to page {target_page}: {str(e)}")
        return False

def add_temporary_css_class(css_class):
    """
    Adds a temporary CSS class to the page.

    Args:
        css_class (str): The CSS class to add.
    """
    # This assumes that the function 'add_css_class' is defined and will add the CSS class
    add_css_class(css_class)

    # Remove the CSS class after a short delay
    # This assumes that the function 'remove_css_class' is defined and will remove the CSS class
    # and that the function 'delay' is defined and will delay the execution of the function
    delay(100, remove_css_class, css_class)

def delay(milliseconds, func, *args, **kwargs):
    """
    Delays the execution of a function.

    Args:
        milliseconds (int): The delay in milliseconds.
        func (function): The function to delay.
        *args: The arguments to pass to the function.
        **kwargs: The keyword arguments to pass to the function.
    """
    # This assumes that the function 'sleep' is defined and will delay the execution
    import time
    time.sleep(milliseconds / 1000)
    func(*args, **kwargs)

def switch_page(page):
    """
    Switches to a different page.

    Args:
        page (str): The page to switch to.
    """
    # This assumes that the function 'switch_page' is defined and will switch to the page
    # For the purpose of this example, we'll just log the page switch
    logging.info(f"Switching to page {page}")

def add_css_class(css_class):
    """
    Adds a CSS class to the page.

    Args:
        css_class (str): The CSS class to add.
    """
    # This assumes that the function 'add_css_class' is defined and will add the CSS class
    # For the purpose of this example, we'll just log the CSS class addition
    logging.info(f"Adding CSS class {css_class}")

def remove_css_class(css_class):
    """
    Removes a CSS class from the page.

    Args:
        css_class (str): The CSS class to remove.
    """
    # This assumes that the function 'remove_css_class' is defined and will remove the CSS class
    # For the purpose of this example, we'll just log the CSS class removal
    logging.info(f"Removing CSS class {css_class}")