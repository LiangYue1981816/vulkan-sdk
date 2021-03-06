#version 310 es
/* Copyright (c) 2017, ARM Limited and Contributors
 *
 * SPDX-License-Identifier: MIT
 *
 * Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

precision mediump float;

layout(location = 0) in highp vec2 vTexCoord;
layout(location = 1) flat in mediump int textureIndex;
layout(location = 2) flat in mediump int highlightSize;
layout(location = 3) flat in mediump int fixedMipLevel;

layout(location = 0) out vec4 FragColor;

layout(set = 0, binding = 0) uniform sampler2D sTexture;
layout(set = 0, binding = 1) uniform sampler2D sSizeLabelTexture;

void main()
{
	// Check the texture to be sampled.
	if (textureIndex == 1)
	{
		// If it's the auxiliary one, just sample it.
		FragColor = texture(sSizeLabelTexture, vTexCoord);
	}
	else
	{
		// Get the hightlight size relative to the normalized texture coordinates.
		float normHighlightSize = 0.02 * float(highlightSize);

		// Sample the texture with a fixed mip level.
		vec4 sampledColor = textureLod(sTexture, vTexCoord, float(fixedMipLevel));

		if (vTexCoord.x < normHighlightSize || vTexCoord.x > (1.0 - normHighlightSize) ||
		    vTexCoord.y < normHighlightSize || vTexCoord.y > (1.0 - normHighlightSize))
		{
			// Draw the red highlight.
			FragColor = vec4(1.0, 0.0, 0.0, 1.0);
		}
		else
		{
			// Use the sampled color.
			FragColor = sampledColor;
		}
	}
}
