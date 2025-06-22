<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'priorite',
        'titre',
        'message',
        'is_resolved',
        'hopital_id',
        'user_id',
        'medical_produit_id',
        'resolved_by',
        'ref',
    ];

    protected $casts = [
        'is_resolved' => 'boolean',
        'resolved_at' => 'datetime',
    ];

    public static function types(): array
    {
        return [
            'stock_faible' => 'Stock Faible',
            'avertissement_expiration' => 'Avertissement Expiration',
            'expire' => 'Produit Expiré',
            'demande_transfert' => 'Demande de Transfert',
            'systeme' => 'Système',
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ref = \Illuminate\Support\Str::uuid();
        });
    }

    public static function priorities(): array
    {
        return [
            'faible' => 'Faible',
            'moyen' => 'Moyen',
            'eleve' => 'Élevé',
            'critique' => 'Critique',
        ];
    }

    // Relations
    public function hopital()
    {
        return $this->belongsTo(Hopital::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function medicalProduit()
    {
        return $this->belongsTo(MedicalProduit::class);
    }

    public function resolvedBy()
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }
}