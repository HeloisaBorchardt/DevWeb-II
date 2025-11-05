package com.example.videoLocadora.exceptions;

public class AtorNaoEncontradoException extends RuntimeException{

	private static final long serialVersionUID = 1L;

		public AtorNaoEncontradoException(String mensagem) {
		super(mensagem);
	}
}
