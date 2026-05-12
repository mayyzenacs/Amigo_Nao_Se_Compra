using System.Globalization;
using System.Text;

namespace AmigoNcompra_api.utils; 

public static class NormalizeCity {

    public static string SearchToken(this string? text)
    {
        if (string.IsNullOrWhiteSpace(text)) return string.Empty;

        ReadOnlySpan<char> source = text.Normalize(NormalizationForm.FormD).AsSpan();

        Span<char> destination = stackalloc char[source.Length];
        int destinationIndex = 0;

        foreach (char c in source)
        {
            UnicodeCategory category = CharUnicodeInfo.GetUnicodeCategory(c);
            
            if (category != UnicodeCategory.NonSpacingMark && !char.IsWhiteSpace(c))
            {
                destination[destinationIndex++] = char.ToUpperInvariant(c);
            }
        }
        return new string(destination[..destinationIndex]);
    }
}
