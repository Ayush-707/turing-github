/* Step(): run the Turing machine for one step. Returns false if the machine is in halt state at the end of the step, true otherwise. */
function Step()
{
	if( bIsDirty) Compile();
	
	bIsReset = false;
	if( sState.substring(0,4).toLowerCase() == "halt" ) {
		/* debug( 1, "Warning: Step() called while in halt state" ); */
		SetStatusMessage( "Halted." );
		EnableControls( false, false, false, true, true, true, true );
		return( false );
	}
	
	var sNewState, sNewSymbol, nAction, nLineNumber;
	
	/* Get current symbol */
	var sHeadSymbol = GetTapeSymbol( nHeadPosition );
	
	/* Find appropriate TM instruction */
	var aInstructions = GetNextInstructions( sState, sHeadSymbol );
	var oInstruction;
	if( aInstructions.length == 0 ) {
    // No matching instruction found. Error handled below.
    oInstruction = null;
	} else if( nVariant == 2 ) {
    // Non-deterministic TM. Choose an instruction at random.
    oInstruction = aInstructions[Math.floor(Math.random()*aInstructions.length)];
	} else {
    // Deterministic TM. Choose the first (and only) instruction.
    oInstruction = aInstructions[0];
	}
	
	if( oInstruction != null ) {
		sNewState = (oInstruction.newState == "*" ? sState : oInstruction.newState);
		sNewSymbol = (oInstruction.newSymbol == "*" ? sHeadSymbol : oInstruction.newSymbol);
		nAction = (oInstruction.action.toLowerCase() == "r" ? 1 : (oInstruction.action.toLowerCase() == "l" ? -1 : 0));
    if( nVariant == 1 && nHeadPosition == 0 && nAction == -1 ) {
      nAction = 0;  /* Can't move left when already at left-most tape cell. */
    }
		nLineNumber = oInstruction.sourceLineNumber;
	} else {
		/* No matching rule found; halt */
		debug( 1, "Warning: no instruction found for state '" + sState + "' symbol '" + sHeadSymbol + "'; halting" );
		SetStatusMessage( "Halted. No rule for state '" + sState + "' and symbol '" + sHeadSymbol + "'.", 2 );
		sNewState = "halt";
		sNewSymbol = sHeadSymbol;
		nAction = 0;
		nLineNumber = -1;
	}
	
	/* Save undo information */
  if( nMaxUndo > 0 ) {
    if( aUndoList.length >= nMaxUndo ) aUndoList.shift();  /* Discard oldest undo entry */
    aUndoList.push({state: sState, position: nHeadPosition, symbol: sHeadSymbol});
  }
	
	/* Update machine tape & state */
	SetTapeSymbol( nHeadPosition, sNewSymbol );
	sState = sNewState;
	nHeadPosition += nAction;
	
	nSteps++;
	
	oPrevInstruction = oInstruction;
	
	debug( 4, "Step() finished. New tape: '" + sTape + "'  new state: '" + sState + "'  action: " + nAction + "  line number: " + nLineNumber  );
	UpdateInterface();
	
	if( sNewState.substring(0,4).toLowerCase() == "halt" ) {
		if( oInstruction != null ) {
			SetStatusMessage( "Halted." );
		} 
		EnableControls( false, false, false, true, true, true, true );
		return( false );
	} else {
		if( oInstruction.breakpoint ) {
			SetStatusMessage( "Stopped at breakpoint on line " + (nLineNumber+1) );
			EnableControls( true, true, false, true, true, true, true );
			return( false );
		} else {
			return( true );
		}
	}
}

/* Undo(): undo a single step of the machine */
function Undo()
{
  var oUndoData = aUndoList.pop();
  if( oUndoData ) {
    nSteps--;
    sState = oUndoData.state;
    nHeadPosition = oUndoData.position;
    SetTapeSymbol( nHeadPosition, oUndoData.symbol );
    oPrevInstruction = null;
    debug( 3, "Undone one step. New state: '" + sState + "' position : " + nHeadPosition + " symbol: '" + oUndoData.symbol + "'" );
    EnableControls( true, true, false, true, true, true, true );
    SetStatusMessage( "Undone one step." /*+ (aUndoList.length == 0 ? " No more undoes available." : " (" + aUndoList.length + " remaining)")*/ );
    UpdateInterface();
  } else {
    debug( 1, "Warning: Tried to undo with no undo data available!" );
  }
}


/* Run(): run the TM until it halts or until user interrupts it */
function Run()
{
  var bContinue = true;
  if( bFullSpeed ) {
    /* Run 25 steps at a time in fast mode */
    for( var i = 0; bContinue && i < 25; i++ ) {
      bContinue = Step();
    }
    if( bContinue ) hRunTimer = window.setTimeout( Run, 10 );
    else UpdateInterface();   /* Sometimes updates get lost at full speed... */
  } else {
    /* Run a single step every 50ms in slow mode */
    if( Step() ) {
      hRunTimer = window.setTimeout( Run, 50 );
    }
  }
}

/* RunStep(): triggered by the run timer. Calls Step(); stops running if Step() returns false. */
function RunStep()
{
	if( !Step() ) {
		StopTimer();
	}
}

/* StopTimer(): Deactivate the run timer. */
function StopTimer()
{
	if( hRunTimer != null ) {
		window.clearInterval( hRunTimer );
		hRunTimer = null;
	}
}


/* Reset( ): re-initialise the TM */
function Reset()
{
	var sInitialTape = $("#InitialInput")[0].value;

	/* Find the initial head location, if given */
	nHeadPosition = sInitialTape.indexOf( "*" );
	if( nHeadPosition == -1 ) nHeadPosition = 0;

	/* Initialise tape */
	sInitialTape = sInitialTape.replace( /\*/g, "" ).replace( / /g, "_" );
	if( sInitialTape == "" ) sInitialTape = " ";
	sTape = sInitialTape;
	nTapeOffset = 0;
	
	/* Initialise state */
	var sInitialState = $("#InitialState")[0].value;
	sInitialState = $.trim( sInitialState ).split(/\s+/)[0];
	if( !sInitialState || sInitialState == "" ) sInitialState = "0";
	sState = sInitialState;
	
	/* Initialise variant */
  var dropdown = $("#MachineVariant")[0];
  nVariant = Number(dropdown.options[dropdown.selectedIndex].value);
  SetupVariantCSS();
	
	nSteps = 0;
	bIsReset = true;
	
	Compile();
	oPrevInstruction = null;
	
	aUndoList = [];
	
	ShowResetMsg(false);
	EnableControls( true, true, false, true, true, true, false );
	UpdateInterface();
}

function createTuringInstructionFromTuple( tuple, line )
{
	return {
		newSymbol: tuple.newSymbol,
		action: tuple.action,
		newState: tuple.newState,
		sourceLineNumber: line,
		breakpoint: tuple.breakpoint
	};
}

function isArray( possiblyArr )
{
	Object.prototype.toString.call(possiblyArr) === "[object Array]";
}

/* Compile(): parse the inputted program and store it in aProgram */
function Compile()
{
	var sSource = oTextarea.value;
	debug( 2, "Compile()" );
	
	/* Clear syntax error messages */
	SetSyntaxMessage( null );
	ClearErrorLines();
	
	/* clear the old program */
	aProgram = new Object;
	
	sSource = sSource.replace( /\r/g, "" );	/* Internet Explorer uses \n\r, other browsers use \n */
	
	var aLines = sSource.split("\n");
	for( var i = 0; i < aLines.length; i++ )
	{
		var oTuple = ParseLine( aLines[i], i );
		if( oTuple.isValid ) {
			debug( 5, " Parsed tuple: '" + oTuple.currentState + "'  '" + oTuple.currentSymbol + "'  '" + oTuple.newSymbol + "'  '" + oTuple.action + "'  '" + oTuple.newState + "'" );
			if( aProgram[oTuple.currentState] == null ) aProgram[oTuple.currentState] = new Object;
			if( aProgram[oTuple.currentState][oTuple.currentSymbol] == null ) {
        aProgram[oTuple.currentState][oTuple.currentSymbol] = [];
			}
			if( aProgram[oTuple.currentState][oTuple.currentSymbol].length > 0 && nVariant != 2 ) {
        // Multiple conflicting instructions found.
        debug( 1, "Warning: multiple definitions for state '" + oTuple.currentState + "' symbol '" + oTuple.currentSymbol + "' on lines " + (aProgram[oTuple.currentState][oTuple.currentSymbol][0].sourceLineNumber+1) + " and " + (i+1) );
        SetSyntaxMessage( "Warning: Multiple definitions for state '" + oTuple.currentState + "' symbol '" + oTuple.currentSymbol + "' on lines " + (aProgram[oTuple.currentState][oTuple.currentSymbol][0].sourceLineNumber+1) + " and " + (i+1) );
        SetErrorLine( i );
        SetErrorLine( aProgram[oTuple.currentState][oTuple.currentSymbol][0].sourceLineNumber );
        aProgram[oTuple.currentState][oTuple.currentSymbol][0] = createTuringInstructionFromTuple( oTuple, i );
			} else {
        aProgram[oTuple.currentState][oTuple.currentSymbol].push( createTuringInstructionFromTuple( oTuple, i ) );
      }
		}
		else if( oTuple.error )
		{
			/* Syntax error */
			debug( 2, "Syntax error: " + oTuple.error );
			SetSyntaxMessage( oTuple.error );
			SetErrorLine( i );
		}
	}
	
	/* Set debug level, if specified */
	oRegExp = new RegExp( ";.*\\$DEBUG: *(.+)" );
	aResult = oRegExp.exec( sSource );
	if( aResult != null && aResult.length >= 2 ) {
		var nNewDebugLevel = parseInt( aResult[1] );
		if( nNewDebugLevel != nDebugLevel ) {
			nDebugLevel = parseInt( aResult[1] );
			debug( 1, "Setting debug level to " + nDebugLevel );
			if( nDebugLevel > 0 ) $(".DebugClass").toggle( true );
		}
	}
	
	/* Lines have changed. Previous line is no longer meaningful, recalculate next line. */
	oPrevInstruction = null;
	
	bIsDirty = false;
	
	UpdateInterface();
}

/* UpdateInterface(): refresh the tape, state and steps displayed on the page */
function UpdateInterface()
{
	RenderTape();
	RenderState();
	RenderSteps();
	RenderLineMarkers();
}


/* SetStatusMessage(): display sString in the status message area */
/* nBgFlash: 1: flash green for success; 2: flash red for failure; -1: do not flash, even if repeating a message */
function SetStatusMessage( sString, nBgFlash )
{
	$( "#MachineStatusMsgText" ).text( sString );
  if( nBgFlash > 0 ) {
    $("#MachineStatusMsgBg").stop(true, true).css("background-color",(nBgFlash==1?"#c9f2c9":"#ffb3b3")).show().fadeOut(600);
  }
  if( sString != "" && sPreviousStatusMsg == sString && nBgFlash != -1 ) {
    $("#MachineStatusMsgBg").stop(true, true).css("background-color","#bbf8ff").show().fadeOut(600);
  }
  if( sString != "" ) sPreviousStatusMsg = sString;
}

/* SetSyntaxMessage(): display a syntax error message in the textarea */
function SetSyntaxMessage( msg )
{
	$("#SyntaxMsg").text( (msg?msg:"") )
}

/* RenderTape(): show the tape contents and head position in the MachineTape div */
function RenderTape()
{
	/* calculate the strings:
	  sFirstPart is the portion of the tape to the left of the head
	  sHeadSymbol is the symbol under the head
	  sSecondPart is the portion of the tape to the right of the head
	*/
	var nTranslatedHeadPosition = nHeadPosition - nTapeOffset;  /* position of the head relative to sTape */
	var sFirstPart, sHeadSymbol, sSecondPart;
	debug( 4, "RenderTape: translated head pos: " + nTranslatedHeadPosition + "  head pos: " + nHeadPosition + "  tape offset: " + nTapeOffset );
	debug( 4, "RenderTape: sTape = '" + sTape + "'" );

	if( nTranslatedHeadPosition > 0 ) {
		sFirstPart = sTape.substr( 0, nTranslatedHeadPosition );
	} else {
		sFirstPart = "";
	}
	if( nTranslatedHeadPosition > sTape.length ) {  /* Need to append blanks to sFirstPart.  Shouldn't happen but just in case. */
		sFirstPart += repeat( " ", nTranslatedHeadPosition - sTape.length );
	}
	sFirstPart = sFirstPart.replace( /_/g, " " );
	
	if( nTranslatedHeadPosition >= 0 && nTranslatedHeadPosition < sTape.length ) {
		sHeadSymbol = sTape.charAt( nTranslatedHeadPosition );
	} else {
		sHeadSymbol = " ";	/* Shouldn't happen but just in case */
	}
	sHeadSymbol = sHeadSymbol.replace( /_/g, " " );
	
	if( nTranslatedHeadPosition >= 0 && nTranslatedHeadPosition < sTape.length - 1 ) {
		sSecondPart = sTape.substr( nTranslatedHeadPosition + 1 );
	} else if( nTranslatedHeadPosition < 0 ) {  /* Need to prepend blanks to sSecondPart. Shouldn't happen but just in case. */
		sSecondPart = repeat( " ", -nTranslatedHeadPosition - 1 ) + sTape;
	} else {  /* nTranslatedHeadPosition > sTape.length */
		sSecondPart = "";
	}
	sSecondPart = sSecondPart.replace( /_/g, " " );
	
	debug( 4, "RenderTape: sFirstPart = '" + sFirstPart + "' sHeadSymbol = '" + sHeadSymbol + "'  sSecondPart = '" + sSecondPart + "'" );
	
	/* Display the parts of the tape */
	$("#LeftTape").text( sFirstPart );
	$("#ActiveTape").text( sHeadSymbol );
	$("#RightTape").text( sSecondPart );
//	debug( 4, "RenderTape(): LeftTape = '" + $("#LeftTape").text() + "' ActiveTape = '" + $("#ActiveTape").text() + "' RightTape = '" + $("#RightTape").text() + "'" );
	
	/* Scroll tape display to make sure that head is visible */
	if( $("#ActiveTapeArea").position().left < 0 ) {
		$("#MachineTape").scrollLeft( $("#MachineTape").scrollLeft() + $("#ActiveTapeArea").position().left - 10 );
	} else if( $("#ActiveTapeArea").position().left + $("#ActiveTapeArea").width() > $("#MachineTape").width() ) {
		$("#MachineTape").scrollLeft( $("#MachineTape").scrollLeft() + ($("#ActiveTapeArea").position().left - $("#MachineTape").width()) + 10 );
	}
}

function RenderState()
{
	$("#MachineState").text( sState );
}

function RenderSteps()
{
	$("#MachineSteps").text( nSteps );
}

function RenderLineMarkers()
{
  var oNextList = $.map(GetNextInstructions( sState, GetTapeSymbol( nHeadPosition ) ), function(x){return(x.sourceLineNumber);} );
	debug( 3, "Rendering line markers: " + (oNextList) + " " + (oPrevInstruction?oPrevInstruction.sourceLineNumber:-1) );
	SetActiveLines( oNextList, (oPrevInstruction?oPrevInstruction.sourceLineNumber:-1) );
}
