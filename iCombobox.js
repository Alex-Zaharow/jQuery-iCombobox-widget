/*
// Examples:

    $(function() 
    {
        $( "#iComboLanguage" ).icombobox({
                                          arrValues: ["ActionScript","AppleScript","Asp","BASIC","C","C++","Clojure","COBOL","ColdFusion","Erlang","Fortran","Groovy","Haskell","Java","JavaScript","Lisp","Perl","PHP","Python","Ruby","Scala","Scheme"]
                                         });
        $( "#iComboDog" ).icombobox({
                                      arrValues: ["Белый гриб", "Вешенка обыкновенная", "Гриб-зонтик пёстрый", "Ежовик жёлтый", "Зеленушка", "Колпак кольчатый", "Лангерманния гигантская", "Лисичка обыкновенная", "Маслёнок обыкновенный", "Навозник белый", "Опёнок луговой", "Подберёзовик", "Подосиновик", "Полёвка цилиндрическая", "Рыжик настоящий", "Сыроежка зеленоватая", "Сыроежка сине-жёлтая", "Трутовик серно-жёлтый", "Шампиньон", "Трюфель", "Цезарский гриб", "Сморчок обыкновенный", "сморчок конический"]
                                    });
    });
    
    Need:
    
*/

(function( $ ) 
{
    // Delete string dublicates.
    // val - Sorted Multistring.
    // return array.
    function split( val ) 
    {
        var v = val.replace(new RegExp("([, ][ ]*)", "gim"), "\n$1\n").split( /\n/gi );
    	return v;
    }
    
    // Get last item of string
    function extractLast( term ) 
    {
    	return split( term ).pop();
    }
    
    // widget
    $.widget( "ui.icombobox", 
    {
        options: {
                   arrValues: [],
                   replace: true   // true - replace value on select, false - append new value at the and of input string
                 },
        setOption: function(key, value) 
                   {
                        if (value != undefined) 
                        {
                          this.options[key] = value;
                          this._render();
                          return this;
                        }
                        else 
                        {
                          return this.options[key];
                        }
                   },
       _create: function() 
                {
                    var input,
                        self        = this;
                        var      av = this.options.arrValues;  // Чтобы добраться до массива из autocomplete: source.
                        var replaceInputValueByAutocomplete = this.options.replace;
    
                    input = $( "<input type='text'/>" )
                                            .appendTo( self.element );
                    input.parent().addClass("slick-headerrow-column-icombobox")
                    input
                                            .addClass( "ui-combobox" )
                                            .addClass( "ui-state-default ui-combobox-input" )
                                            .autocomplete(
                                                            {
                                                                delay: 0,
                                                                minLength: 0,
                                                                source: function( request, response ) 
                                                                        {
                                                        					// delegate back to autocomplete, but extract the last term
                                                        					response( $.ui.autocomplete.filter(av, extractLast( request.term ) ) );
                                                        				},
                                                                select: function( event, ui ) 
                                                                        {
                                                                            if(replaceInputValueByAutocomplete==true)
                                                                            {
                                                            					this.value = ui.item.value; //terms.join( "" );
                                                            					// fire "change" event
                                                            					$(this).trigger('change');
                                                            					return false;
                                                            				}
                                                            				else
                                                            				{
                                                                                var terms = split( this.value );
                                                            					// remove the current input
                                                            					terms.pop();
                                                            					// add the selected item
                                                            					terms.push( ui.item.value );
                                                            					// add placeholder to get the comma-and-space at the end
                                                            					terms.push( "" );
                                                            					this.value = terms.join( "" );
                                                            					return false;
                                                            				}
                                                                        },
                                                				focus: function() {
                                                					// prevent value inserted on focus
                                                					return false;
                                                				}
                                                                /*
                                                                change: function( event, ui ) 
                                                                        {
                                                                            if ( !ui.item ) {
                                                                                var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i" ),
                                                                                    valid = false;
                                                                                select.children( "option" ).each(function() {
                                                                                    if ( $( this ).text().match( matcher ) ) {
                                                                                        this.selected = valid = true;
                                                                                        return false;
                                                                                    }
                                                                                });
                                                                                if ( !valid ) {
                                                                                    // remove invalid value, as it didn't match anything
                                                                                    $( this ).val( "" );
                                                                                    select.val( "" );
                                                                                    input.data( "autocomplete" ).term = "";
                                                                                    return false;
                                                                                }
                                                                            }
                                                                        }
                                                                //*/
                                                     })
                                            .addClass( "ui-widget ui-widget-content ui-corner-left" );
    
                    input.data( "autocomplete" )._renderItem =  function( ul, item ) 
                                                                {
                                                                    return $( "<li></li>" )
                                                                        .data( "item.autocomplete", item )
                                                                        .append( "<a>" + item.label + "</a>" )
                                                                        .appendTo( ul );
                                                                };
    
                    $( "<a>" )
                        .attr( "tabIndex", -1 )
                        .attr( "title", "Show unique items in this column" )
                        .appendTo( self.element )
                        .button({
                            icons: {
                                primary: "ui-icon-triangle-1-s"
                            },
                            text: false
                        })
                        .removeClass( "ui-corner-all" )
                        .addClass( "ui-corner-right ui-combobox-toggle" )
                        .click( function() 
                                {
                                    // close if already visible
                                    if ( input.autocomplete( "widget" ).is( ":visible" ) ) 
                                    {
                                        input.autocomplete( "close" );
                                        return;
                                    }
            
                                    // work around a bug (likely same cause as #5265)
                                    $( this ).blur();
            
                                    // pass empty string as value to search for, displaying all results
                                    input.autocomplete( "search", "" );
                                    input.focus();
                                });
                    $( "<a>" )
                        .attr( "tabIndex", -1 )
                        .attr( "title", "clear filter" )
                        .appendTo( self.element )
                        .button({
                            icons: {
                                primary: "ui-icon-close"
                            },
                            text: false
                        })
                        .removeClass( "ui-corner-all" )
                        .addClass( "ui-corner-right ui-combobox-toggle" )
                        .click( function() 
                                {
                                    // pass empty string as value to search for, displaying all results
                                    input.val("");
                                    $(input).trigger('change');
                                    input.focus();
                                    
                                    // close if already visible
                                    if ( input.autocomplete( "widget" ).is( ":visible" ) ) 
                                    {
                                        input.autocomplete( "close" );
                                        return;
                                    }
            
                                    // work around a bug (likely same cause as #5265)
                                    $( this ).blur();
                                });
                },

        destroy: function() {
            this.wrapper.remove();
            this.element.show();
            $.Widget.prototype.destroy.call( this );
        }
    });
})( jQuery );