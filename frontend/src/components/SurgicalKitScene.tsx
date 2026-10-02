import { useId } from 'react';


/** Surgical kit floats independently above a stationary map. */
export function SurgicalKitScene() {
  const id = useId().replace(/:/g, '');

  return <div role="img" aria-label="Deep teal and cream surgical kit floating above a stationary map with three pharmacy pins"
    style={{ width: '100%', maxWidth: 520, aspectRatio: '600 / 650', userSelect: 'none', isolation: 'isolate' }}>
<svg aria-hidden="true" style={{ width: '100%', height: '100%', overflow: 'visible', display: 'block' }} viewBox="0 0 600 650" fill="none">
<defs>
 <linearGradient id={`${id}-cream`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#FFFEFA"/><stop offset=".55" stopColor="#EFE5D7"/><stop offset="1" stopColor="#D3C2AD"/></linearGradient>
 <linearGradient id={`${id}-teal`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#5D939B"/><stop offset=".5" stopColor="#326772"/><stop offset="1" stopColor="#173F49"/></linearGradient>
 <linearGradient id={`${id}-clay`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#DF9C75"/><stop offset="1" stopColor="#A85E3F"/></linearGradient>
 <linearGradient id={`${id}-blue`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#AFD0DC"/><stop offset="1" stopColor="#628FA3"/></linearGradient>
 <linearGradient id={`${id}-inside`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#A68C6F"/><stop offset=".5" stopColor="#D6C3AA"/><stop offset="1" stopColor="#E7D8C4"/></linearGradient>
 <filter id={`${id}-shadow`} x="-35%" y="-40%" width="170%" height="190%"><feGaussianBlur stdDeviation="16"/></filter>
 <filter id={`${id}-soft`} x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#29474C" floodOpacity=".18"/></filter>
 <pattern id={`${id}-gauze`} width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0H4M0 0V4" stroke="#D4C9B8" strokeWidth=".45"/></pattern>

<radialGradient id={`${id}-ceramic`} cx=".28" cy=".2" r=".95"><stop stopColor="#FFFFFF"/><stop offset=".45" stopColor="#EBE1D3"/><stop offset=".8" stopColor="#C4B39E"/><stop offset="1" stopColor="#9C8971"/></radialGradient>
<radialGradient id={`${id}-padding`} cx=".62" cy=".7" r=".8"><stop stopColor="#C6AF91"/><stop offset=".65" stopColor="#A88C6A"/><stop offset="1" stopColor="#6A543E"/></radialGradient>
<linearGradient id={`${id}-edge`} x1="0%" y1="0%" x2="0%" y2="100%"><stop stopColor="#FFFDFA"/><stop offset=".35" stopColor="#F2E9DC"/><stop offset="1" stopColor="#C4B39E"/></linearGradient>
<radialGradient id={`${id}-puff`} cx=".35" cy=".3" r=".72"><stop stopColor="#FFFFFF" stopOpacity=".34"/><stop offset=".48" stopColor="#FFFFFF" stopOpacity=".05"/><stop offset=".82" stopColor="#233F42" stopOpacity=".06"/><stop offset="1" stopColor="#233F42" stopOpacity=".29"/></radialGradient>
<filter id={`${id}-bevel`} x="-30%" y="-30%" width="170%" height="180%" colorInterpolationFilters="sRGB"><feGaussianBlur in="SourceAlpha" stdDeviation="2.8" result="blur"/><feSpecularLighting in="blur" surfaceScale="4" specularConstant=".3" specularExponent="18" lightingColor="#FFFFFF" result="light"><feDistantLight azimuth="225" elevation="45"/></feSpecularLighting><feComposite in="light" in2="SourceAlpha" operator="in" result="clipped"/><feBlend in="SourceGraphic" in2="clipped" mode="screen"/></filter>
<filter id={`${id}-contact`} x="-40%" y="-40%" width="180%" height="190%"><feDropShadow dx="4" dy="8" stdDeviation="4" floodColor="#3E3428" floodOpacity=".3"/></filter>
</defs>
<ellipse cx="309" cy="577" rx="205" ry="29" fill="#38545B" opacity=".27" filter={`url(#${id}-shadow)`}/>
{/* Map slab and editable city blocks */}
<path d="M51 444Q48 434 64 427L319 350Q331 347 344 352L552 458Q564 464 558 480L558 500Q558 509 545 516L296 612Q281 618 265 610L63 489Q51 482 51 470Z" fill={`url(#${id}-ceramic)`}/>
<path d="M63 425L316 345Q332 340 347 348L551 453Q570 463 550 474L295 576Q281 581 267 573L61 452Q41 439 63 425Z" fill="#FBF7EF" stroke="#E4D9CB" strokeWidth="2"/>
<g transform="matrix(.84 .43 -.94 .32 319 350)">
<rect width="253" height="265" rx="15" fill="#F5EEE3"/>
<path d="M0 82H253M0 184H253M85 0V265M181 0V265" stroke="#FFFCF6" strokeWidth="14"/>
<path d="M0 137H253M135 0V265" stroke="#A4BAB9" strokeWidth="10"/>
<rect x="9" y="10" width="62" height="57" rx="8" fill="#D0E1E7"/>
<rect x="97" y="10" width="26" height="57" rx="5" fill="#EAD8C6"/>
<rect x="148" y="10" width="22" height="57" rx="5" fill="#F0D7C4"/>
<rect x="195" y="10" width="45" height="57" rx="8" fill="#D9E5E5"/>
<rect x="9" y="94" width="62" height="29" rx="6" fill="#E8B99B"/>
<rect x="195" y="94" width="45" height="29" rx="6" fill="#E2C7AE"/>
<rect x="9" y="150" width="62" height="22" rx="5" fill="#DED0BD"/>
<rect x="195" y="150" width="45" height="22" rx="5" fill="#CFD8C9"/>
<rect x="9" y="198" width="62" height="52" rx="8" fill="#D8E6EA"/>
<rect x="98" y="198" width="26" height="52" rx="5" fill="#EDC2A7"/>
<rect x="148" y="198" width="22" height="52" rx="5" fill="#E5D5C2"/>
<rect x="195" y="198" width="45" height="52" rx="8" fill="#C4DCE5"/>
</g>
<path d="M171 431C217 438 247 435 267 469S355 523 435 474" stroke="#2C6571" strokeWidth="7" strokeLinecap="round" strokeDasharray="1 15"/>
<ellipse cx="311" cy="439" rx="100" ry="26" fill="#496067" opacity=".25" filter={`url(#${id}-shadow)`}/>
{/* Three upright location markers */}
<g transform="translate(169 432) scale(0.76)" filter={`url(#${id}-contact)`}><ellipse cy="2" rx="15" ry="5" fill="#395B61" opacity=".2"/><path d="M0 0C-9-17-35-41-35-65A35 35 0 0 1 35-65C35-41 9-17 0 0Z" transform="translate(5 -4)" fill="#315A60" opacity=".7"/><path filter={`url(#${id}-bevel)`} d="M0 0C-9-17-35-41-35-65A35 35 0 0 1 35-65C35-41 9-17 0 0Z" fill={`url(#${id}-clay)`} stroke="#FFFFFF" strokeOpacity=".3" strokeWidth="2"/><circle cx="1" cy="-63" r="16" fill="#28464D" opacity=".35"/><circle cy="-65" r="15" fill={`url(#${id}-edge)`} stroke="#FFFEFA" strokeWidth="1.5"/></g><g transform="translate(310 499) scale(1)" filter={`url(#${id}-contact)`}><ellipse cy="2" rx="15" ry="5" fill="#395B61" opacity=".2"/><path d="M0 0C-9-17-35-41-35-65A35 35 0 0 1 35-65C35-41 9-17 0 0Z" transform="translate(5 -4)" fill="#315A60" opacity=".7"/><path filter={`url(#${id}-bevel)`} d="M0 0C-9-17-35-41-35-65A35 35 0 0 1 35-65C35-41 9-17 0 0Z" fill={`url(#${id}-teal)`} stroke="#FFFFFF" strokeOpacity=".3" strokeWidth="2"/><circle cx="1" cy="-63" r="16" fill="#28464D" opacity=".35"/><circle cy="-65" r="15" fill={`url(#${id}-edge)`} stroke="#FFFEFA" strokeWidth="1.5"/></g><g transform="translate(441 477) scale(0.72)" filter={`url(#${id}-contact)`}><ellipse cy="2" rx="15" ry="5" fill="#395B61" opacity=".2"/><path d="M0 0C-9-17-35-41-35-65A35 35 0 0 1 35-65C35-41 9-17 0 0Z" transform="translate(5 -4)" fill="#315A60" opacity=".7"/><path filter={`url(#${id}-bevel)`} d="M0 0C-9-17-35-41-35-65A35 35 0 0 1 35-65C35-41 9-17 0 0Z" fill={`url(#${id}-blue)`} stroke="#FFFFFF" strokeOpacity=".3" strokeWidth="2"/><circle cx="1" cy="-63" r="16" fill="#28464D" opacity=".35"/><circle cy="-65" r="15" fill={`url(#${id}-edge)`} stroke="#FFFEFA" strokeWidth="1.5"/></g>
{/* Floating surgical kit */}
<g className="surgical-kit-float">
<ellipse cx="310" cy="373" rx="145" ry="18" fill="#25454B" opacity=".08" filter={`url(#${id}-shadow)`}/>
{/* Raised lid, with a teal rim and padded beige interior */}
<path d="M177 43Q163 20 193 22L437 51Q463 54 466 82L459 237L169 196Z" fill={`url(#${id}-ceramic)`} stroke="#D5CAB9" strokeWidth="2"/>
<path d="M178 42Q179 28 199 32L436 61Q453 63 453 84L447 229L171 193Z" fill={`url(#${id}-teal)`}/>
<path d="M188 54Q188 43 202 45L427 73Q439 75 439 88L434 213L184 183Z" fill={`url(#${id}-padding)`} stroke="#E8DBCA" strokeWidth="3"/>
<path d="M204 62L418 90" stroke="#A48D73" strokeWidth="2" opacity=".35"/>
<rect x="218" y="19" width="34" height="17" rx="5" fill={`url(#${id}-ceramic)`} transform="rotate(7 218 19)"/>
<rect x="399" y="42" width="34" height="17" rx="5" fill={`url(#${id}-ceramic)`} transform="rotate(7 399 42)"/>
<path d="M180 180L184 58Q184 36 206 42L427 70" stroke="#FFFFFF" strokeOpacity=".55" strokeWidth="3" strokeLinecap="round"/>{/* Open case cavity */}
<path d="M169 178L447 219Q468 223 467 244L423 322L122 258Q100 252 116 230Z" fill={`url(#${id}-teal)`} stroke="#D7E1DB" strokeWidth="5"/>
<path d="M172 190L440 230Q451 232 447 244L415 304L130 248Z" fill="#9C886D"/>
{/* Supply packs with sealed edges and gauze */}
<g transform="translate(185 129) rotate(16)" filter={`url(#${id}-contact)`}><rect filter={`url(#${id}-bevel)`} width="78" height="111" rx="13" fill={`url(#${id}-teal)`}/><rect x="1" y="1" width="76" height="109" rx="12" fill={`url(#${id}-puff)`}/><path d="M7 17Q12 10 68 16M7 94Q17 103 69 97" stroke="#FFFFFF" strokeOpacity=".24" strokeWidth="2"/><path d="M3 5H75M3 9H75M3 106H75" stroke="#FFFFFF" strokeOpacity=".3" strokeWidth="2"/><rect x="12" y="22" width="54" height="71" rx="5" fill="#F8F3E9"/><path d="M33 31H45V42H56V54H45V65H33V54H22V42H33Z" fill="#4E858E"/></g><g transform="translate(294 147) rotate(16)" filter={`url(#${id}-contact)`}><rect filter={`url(#${id}-bevel)`} width="87" height="113" rx="13" fill={`url(#${id}-blue)`}/><rect x="1" y="1" width="85" height="111" rx="12" fill={`url(#${id}-puff)`}/><path d="M7 17Q12 10 77 16M7 96Q17 105 78 99" stroke="#FFFFFF" strokeOpacity=".24" strokeWidth="2"/><path d="M3 5H84M3 9H84M3 108H84" stroke="#FFFFFF" strokeOpacity=".3" strokeWidth="2"/><rect x="12" y="22" width="63" height="73" rx="5" fill="#F8F3E9"/><rect x="14" y="24" width="59" height="69" rx="3" fill={`url(#${id}-gauze)`}/></g><g transform="translate(229 208) rotate(16)" filter={`url(#${id}-contact)`}><rect filter={`url(#${id}-bevel)`} width="73" height="79" rx="13" fill={`url(#${id}-clay)`}/><rect x="1" y="1" width="71" height="77" rx="12" fill={`url(#${id}-puff)`}/><path d="M7 17Q12 10 63 16M7 62Q17 71 64 65" stroke="#FFFFFF" strokeOpacity=".24" strokeWidth="2"/><path d="M3 5H70M3 9H70M3 74H70" stroke="#FFFFFF" strokeOpacity=".3" strokeWidth="2"/><rect x="12" y="22" width="49" height="39" rx="5" fill="#F8F3E9"/><rect x="14" y="24" width="45" height="35" rx="3" fill={`url(#${id}-gauze)`}/></g><g transform="translate(344 231) rotate(16)" filter={`url(#${id}-contact)`}><rect filter={`url(#${id}-bevel)`} width="63" height="68" rx="13" fill={`url(#${id}-ceramic)`}/><rect x="1" y="1" width="61" height="66" rx="12" fill={`url(#${id}-puff)`}/><path d="M7 17Q12 10 53 16M7 51Q17 60 54 54" stroke="#FFFFFF" strokeOpacity=".24" strokeWidth="2"/><path d="M3 5H60M3 9H60M3 63H60" stroke="#FFFFFF" strokeOpacity=".3" strokeWidth="2"/><rect x="12" y="22" width="39" height="28" rx="5" fill="#F8F3E9"/><rect x="14" y="24" width="35" height="24" rx="3" fill={`url(#${id}-gauze)`}/></g>
{/* Case front and right side */}
<path d="M113 250L391 312Q411 316 424 302L460 245L454 312Q452 326 439 345L408 385Q397 398 379 394L137 337Q119 332 117 314Z" fill={`url(#${id}-ceramic)`} stroke="#DACFBD" strokeWidth="1.5"/>
<path d="M391 312Q411 316 424 302L460 245L454 312Q451 328 439 345L408 385Q400 395 387 395Z" fill="#AE9A82" opacity=".28"/>
<path d="M116 250L390 313Q409 317 424 301L459 245" stroke="#265864" strokeWidth="9"/>
<path d="M118 260L387 322" stroke="#FFFEF7" strokeWidth="2" opacity=".85"/>
<path d="M122 256L388 316Q409 321 426 302" stroke="#85B0B3" strokeWidth="2.5" strokeLinecap="round"/><path d="M125 269L132 310Q133 324 149 329L365 380" stroke="#FFFFFF" strokeOpacity=".4" strokeWidth="3" strokeLinecap="round"/>{/* Clasps */}
<g transform="translate(157 266) rotate(13)"><rect width="25" height="33" rx="6" fill="#A18C72"/><rect x="-2" y="-3" width="24" height="31" rx="5" fill={`url(#${id}-ceramic)`}/><path d="M2 20H18" stroke="#B19C80" strokeWidth="2"/></g>
<g transform="translate(348 309) rotate(13)"><rect width="25" height="33" rx="6" fill="#A18C72"/><rect x="-2" y="-3" width="24" height="31" rx="5" fill={`url(#${id}-ceramic)`}/><path d="M2 20H18" stroke="#B19C80" strokeWidth="2"/></g>
{/* Medical emblem */}
<g transform="translate(267 323) rotate(13)"><ellipse rx="30" ry="29" fill="#315E66"/><ellipse cx="-2" cy="-2" rx="28" ry="28" fill={`url(#${id}-teal)`} stroke="#90B3B6"/><path d="M-8-20H5V-8H17V5H5V17H-8V5H-20V-8H-8Z" fill="#FFFCF4"/></g>
</g>
</svg>

  </div>;
}
