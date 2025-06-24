@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
<img src="https://mascodeproduct.com/fps.png" class="logo" alt="Laravel Logo">
{!! $slot !!}
</a>
</td>
</tr>
