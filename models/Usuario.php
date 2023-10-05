<?php 

namespace Model;

class Usuario extends ActiveRecord {
    //Base de datos
    protected static $tabla = 'usuarios';
    protected static $columnasDB = ['id', 'nombre' , 'telefono', 'apellido', 'password', 'confirmado', 'token', 'admin', 'email'];

    public $id ;
    public $nombre ;
    public $telefono ;
    public $apellido ;
    public $password ;
    public $confirmado ;
    public $token ;
    public $admin ;
    public $email ;

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;   
        $this->nombre = $args['nombre'] ?? '';   
        $this->telefono = $args['telefono'] ?? '';   
        $this->apellido = $args['apellido'] ?? '';   
        $this->password = $args['password'] ?? '';   
        $this->confirmado = $args['confirmado'] ?? '0   ';   
        $this->token = $args['token'] ?? '';   
        $this->admin = $args['admin'] ?? '0';   
        $this->email = $args['email'] ?? '';   
    }
   

    //mensajes de validacion para la creacion de una cuenta
    public function validarNuevaCuenta() {
        if(!$this->nombre) {
            self::$alertas['error'][] = 'El Nombre Es Obligatorio';
        }
        if(!$this->apellido) {
            self::$alertas['error'][] = 'El Apellido Es Obligatorio';
        }
        if(!$this->email) {
            self::$alertas['error'][] = 'El Email Es Obligatorio';
        }
        if(!$this->password) {
            self::$alertas['error'][] = 'El Password Es Obligatorio';
        }
        if(strlen($this->password) < 6) {
            self::$alertas['error'][] = 'El password debe tener al menos 6 caracteres';
        }
        return self::$alertas;
    }
    public function validarLogin() {
        if(!$this->email) {
            self::$alertas['error'][] = 'El email es Obligatorio';
        }

        if(!$this->password) {
            self::$alertas['error'][] = 'El Password es Obligatorio';
        }
        return self::$alertas;  
    }

    public function validarPassword() {
        if(!$this->password) {
            self::$alertas['error'][] = 'El Password es obligatorio';
        }

        if(strlen($this->password) < 6) {
            self::$alertas['error'][] = 'El password debe tener al menos 6 caracteres';
        }

        return self::$alertas;  
    } 

    public function validarEmail() {
        if(!$this->email) {
            self::$alertas['error'][] = 'El email es Obligatorio';
        }
        return self::$alertas;
    }

    public function existeUsuario() {
        $query = " SELECT * FROM " . self::$tabla . " WHERE email = '" . $this->email  . "' LIMIT 1";

        $resultado = self::$db->query($query);
        if($resultado->num_rows) {
            self::$alertas['error'][] = 'El Usuario ya esta registrado';
        }

        return $resultado;  
    }

    public function hashPassword() {
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);
    }
    
    public function crearToken() {
        $this->token = uniqid();
    }

    public function comprobarPasswordAndVerificado($password) {
        
        $resultado = password_verify($password, $this->password);

        if(!$resultado || !$this->confirmado) {
            self::$alertas['error'][] = 'Password incorrecto o tu cuenta no ha sido confirmada';
        } else {
            return true;
        }
    }   
}       