# Pagination

Display a series of buttons to navigate through a list of items.

```blade
<!-- $orders = Order::paginate() -->
<flux:pagination :paginator="$orders" />
```

## Simple paginator
Use the simple paginator when working with large datasets where counting the total number of results would be expensive. The simple paginator provides "Previous" and "Next" buttons without displaying the total number of pages or records.

```blade
<!-- $orders = Order::simplePaginate() -->
<flux:pagination :paginator="$orders" />
```

## Large result set
When working with large result sets, the pagination component automatically adapts to show a reasonable number of page links. It shows the first and last pages, along with a window of pages around the current page, and adds ellipses for any gaps to ensure efficient navigation through numerous pages.

```blade
<!-- $orders = Order::paginate(5) -->
<flux:pagination :paginator="$orders" />
```

## Scroll to top

Use the scroll-to prop to scroll the page when a pagination button is clicked. By default, it scrolls to the body element.

```blade
<flux:pagination :paginator="$orders" scroll-to />
```

You can also target a specific element by passing a CSS selector.

```blade
<flux:pagination :paginator="$orders" scroll-to="#table" />
```

## Reference

### flux:pagination
| Prop | Description |
| --- | --- |
| paginator | The paginator instance to display. |
| scroll-to | Scroll to an element when a pagination button is clicked. Pass a CSS selector to target a specific element. Default: body. |